import React from "react";

// This is the main component for the page
const Home: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* Top section */}
      <header style={styles.header}>
        <div style={styles.searchBar}></div>
        <h1 style={styles.title}>welcome</h1>
      </header>

      {/* Middle Section with Tangle Title */}
      <main style={styles.main}>
        <h1 style={styles.tangleTitle}>Tangle</h1>
        <p style={styles.subtitle}>connect the north</p>

        {/* Buttons */}
        <div style={styles.buttonContainer}>
          <button style={styles.button}>Start now</button>
          <p style={styles.loginText}>or <a href="/login">login</a></p>
        </div>
      </main>

      {/* Organizer and Dash labels (optional, for context) */}
      <div style={styles.labels}>
        <p>organizer dash</p>
      </div>
    </div>
  );
};

export default Home;

// Inline styles for the page
const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "'Courier New', monospace",
    backgroundColor: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    padding: "10px 20px",
    boxSizing: "border-box" as "border-box",
  },
  searchBar: {
    width: "200px",
    height: "30px",
    border: "1px solid black",
  },
  title: {
    fontSize: "24px",
    textAlign: "center" as "center",
  },
  main: {
    textAlign: "center" as "center",
    marginTop: "50px",
  },
  tangleTitle: {
    fontSize: "64px",
    fontFamily: "'Dancing Script', cursive",
    margin: "0",
    padding: "0",
  },
  subtitle: {
    fontSize: "18px",
    marginTop: "10px",
  },
  buttonContainer: {
    marginTop: "30px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    border: "1px solid black",
    backgroundColor: "white",
    cursor: "pointer",
  },
  loginText: {
    marginTop: "20px",
  },
  labels: {
    position: "absolute" as "absolute",
    top: "10px",
    right: "10px",
  },
};
