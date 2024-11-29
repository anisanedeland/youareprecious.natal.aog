import React, { useState, useEffect } from "react";
import VerseDisplay from "../components/VerseDisplay";
import verses from "../data/verses.json";
import ReskinnedButton from "../components/ReskinnedButton";
import WelcomeBanner from "../components/WelcomeBanner";

export default function Home() {
  const [currentVerse, setCurrentVerse] = useState(null);
  const [userName, setUserName] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const savedName = sessionStorage.getItem("userName");
    if (savedName) {
      setUserName(savedName);
      setIsFirstVisit(false);
    }

    const lastClickTime = sessionStorage.getItem("lastClickTime");
    if (lastClickTime) {
      const elapsedTime = Date.now() - parseInt(lastClickTime, 10);
      if (elapsedTime < 5 * 60 * 1000) {
        setIsButtonDisabled(true);
        setTimeout(
          () => setIsButtonDisabled(false),
          5 * 60 * 1000 - elapsedTime
        );
      }
    }
  }, []);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      sessionStorage.setItem("userName", userName);
      setIsFirstVisit(false);
    }
  };

  const getRandomVerse = () => {
    if (loading || isButtonDisabled) return;

    setLoading(true);
    setIsButtonDisabled(true);

    // Save the current time to sessionStorage
    const currentTime = Date.now();
    sessionStorage.setItem("lastClickTime", currentTime);

    // Simulate loading for 5 seconds
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * verses.length);
      setCurrentVerse(verses[randomIndex]);
      setLoading(false);
    }, 5000);

    // Re-enable the button after 5 minutes
    setTimeout(() => setIsButtonDisabled(false), 3 * 1000);
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px",
        minHeight: "100vh",
        margin: 0,
        backgroundColor: "#0d0d0d",
        backgroundImage: "url('/img/CURTAINS.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          backgroundImage: "url('/img/aog_white.png')",
          backgroundSize: "contain", // Ensures the logo fits within the div
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "150px", // Adjust height to fit the logo size
          width: "100%", // Ensures it spans the full width of the container
          marginBottom: "20px", // Adds spacing below the logo
          marginTop: "40px",
        }}
      ></div>
      <h1
        style={{
          fontFamily: "Avaleigh, sans-serif",
          textAlign: "center",
          padding: "20px",
          color: "#d7a528",
          fontSize: "48px",
        }}
      >
        You Are Precious
      </h1>

      {isFirstVisit ? (
        <form onSubmit={handleNameSubmit} style={{ margin: "20px 0" }}>
          <label htmlFor="name" style={{ fontSize: "18px", color: "#ff4500" }}>
            Enter your name:
          </label>
          <br />
          <input
            id="name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              margin: "10px 0",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "100px",
            }}
          >
            <ReskinnedButton
              text="Save Name"
              onClick={handleNameSubmit}
              style={{
                backgroundColor: "#ff4500",
                color: "#fff",
                marginTop: "20px",
              }}
            />
          </div>
        </form>
      ) : (
        <>
          <WelcomeBanner userName={userName} />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <ReskinnedButton
              text={loading ? "Loading..." : "Get a Random Verse"}
              onClick={getRandomVerse}
              style={{
                backgroundColor: isButtonDisabled ? "#ccc" : "#ff4500",
                color: "#fff",
                cursor: isButtonDisabled ? "not-allowed" : "pointer",
              }}
              disabled={isButtonDisabled}
            />
          </div>
          {currentVerse && <VerseDisplay verse={currentVerse} />}
        </>
      )}
    </div>
  );
}