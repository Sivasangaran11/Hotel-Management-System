import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/style-congrats.css";
const CongratsPage = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const doneElement = document.querySelector(".done");
      if (doneElement) {
        doneElement.classList.add("drawn");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="Body">
      <div className="contain">
        <div className="congrats">
          <h1>
            Congrat<span className="hide">ulation</span>s!
          </h1>
          <div className="done">
            <svg
              version="1.1"
              id="tick"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 37 37"
              style={{ enableBackground: "new 0 0 37 37" }}
              xmlSpace="preserve"
            >
              <path
                className="circ path"
                style={{
                  fill: "#0cdcc7",
                  stroke: "#07a796",
                  strokeWidth: "3",
                  strokeLinejoin: "round",
                  strokeMiterlimit: "10",
                }}
                d="M30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z"
              />
              <polyline
                className="tick path"
                style={{
                  fill: "none",
                  stroke: "#fff",
                  strokeWidth: "3",
                  strokeLinejoin: "round",
                  strokeMiterlimit: "10",
                }}
                points="11.6,20 15.9,24.2 26.4,13.8"
              />
            </svg>
          </div>

          <div className="text">
            <p>
              Your order has been placed successfully.
              <br />
              Order-ID: 20210001
              <br />
              <Link to="/track" className="butt">
                <button className="button-congrats">
                  <h5 className="links">Track Order</h5>
                </button>
              </Link>{" "}
              <Link to="/" className="butt">
                <button className="button-congrats">
                  <h5 className="links">Return Home</h5>
                </button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CongratsPage;
