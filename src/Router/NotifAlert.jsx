import { useState, useEffect } from "react";
import  supabase  from "../supabaseClient";

export const useNotifications = () => {
  const [user, setUser] = useState(null);
  const [newAlert, setNewAlert] = useState(null);

  // Load logged-in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Realtime subscription
    const channel = supabase
      .channel("realtime_notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const notif = payload.new;

          // Check if it's for THIS USER
          if (notif.recipient_id === user.id) {
            alert('Check Your Notifications')
            setNewAlert("You have a new notification"); // Trigger alert
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { newAlert, setNewAlert };
};