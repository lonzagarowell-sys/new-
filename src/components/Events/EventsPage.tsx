import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  where,
} from "firebase/firestore";

type Event = {
  id: string;
  title: string;
  description?: string;
  slots?: number;
  date: any; // Firestore Timestamp or string
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [booked, setBooked] = useState<string[]>([]);

  // Fetch events
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snap) => {
      setEvents(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Event[]
      );
    });
    return () => unsub();
  }, []);

  // Fetch booked events of current user
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "bookings"),
      where("uid", "==", auth.currentUser.uid)
    );
    const unsub = onSnapshot(q, (snap) =>
      setBooked(snap.docs.map((d) => d.data().eventId))
    );
    return () => unsub();
  }, []);

  const bookEvent = async (eventId: string) => {
    if (!auth.currentUser) return;
    await addDoc(collection(db, "bookings"), {
      uid: auth.currentUser.uid,
      eventId,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Available Activities</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((e) => {
          const isBooked = booked.includes(e.id);
          const dateString = e.date?.toDate
            ? e.date.toDate().toLocaleDateString()
            : e.date;

          return (
            <div
              key={e.id}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition-shadow"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {e.title}
                </h3>
                {e.description && (
                  <p className="text-sm text-gray-600 mt-1">{e.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Date: {dateString}
                </p>
                {e.slots !== undefined && (
                  <p className="text-sm text-gray-500">Slots: {e.slots}</p>
                )}
              </div>
              <button
                disabled={isBooked}
                onClick={() => bookEvent(e.id)}
                className={`px-4 py-2 rounded-lg mt-4 font-medium transition-colors 
                  ${
                    isBooked
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
              >
                {isBooked ? "Booked" : "Book Now"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
