// src/hooks/useToggleSave.js
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import toast from "react-hot-toast";
import URL from "../url"; // Adjust path as needed

export default function useToggleSave() {
  const cookies = new Cookies();
  const [savedFunds, setSavedFunds] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);

  const token = cookies.get("token");

  // Fetch saved funds on mount
  useEffect(() => {
    if (!token) return;
    fetch(`${URL}/api/mutualfunds`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSavedFunds(data))
      .catch((err) => {
        console.error("Failed to fetch saved funds", err);
        toast.error("Could not fetch saved funds");
      });
  }, []);

  const toggleSave = async (fund) => {
    if (!token) {
      toast.error("You need to be logged in to save funds");
      return;
    }

    setSaveLoading(true);
    const alreadySaved = savedFunds && savedFunds.length > 0 && savedFunds.find(
      (f) => f.schemeCode === fund.schemeCode
    );

    try {
      if (alreadySaved) {
        const res = await fetch(`${URL}/api/mutualfunds/${fund.schemeCode}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          toast.error("Failed! Try refreshing the page or login again");
          throw new Error(`Remove failed: ${res.status}`);
        }

        setSavedFunds((prev) =>
          prev.filter((f) => f.schemeCode !== fund.schemeCode)
        );
      } else {
        const res = await fetch(`${URL}/api/mutualfunds`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(fund),
        });

        if (!res.ok) {
          toast.error("Failed! Try refreshing the page or login again");
          throw new Error(`Save failed: ${res.status}`);
        }

        setSavedFunds((prev) => [...prev, fund]);
      }
    } catch (err) {
      console.error("Error while saving/removing fund:", err);
      // toast.error("Something went wrong");
    } finally {
      setSaveLoading(false);
    }
  };

  return {
    savedFunds,
    setSavedFunds,
    saveLoading,
    toggleSave,
  };
}
