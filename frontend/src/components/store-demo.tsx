import { useAuth, useUI, useNotifications } from "../stores/useStore";
import type { User } from "../stores/types";

export function StoreDemo() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const {
    theme,
    sidebarOpen,
    toggleTheme,
    toggleSidebar,
    openModal,
    closeModal,
    modal,
  } = useUI();
  const { notifications, addNotification, removeNotification } =
    useNotifications();

  const handleLogin = () => {
    const mockUser: User = {
      id: "1",
      email: "user@example.com",
      name: "John Doe",
      avatar: "👤",
    };

    const mockTokens = {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    };

    login(mockUser, mockTokens);
    addNotification("success", "Logged in successfully!");
  };

  const handleLogout = () => {
    logout();
    addNotification("info", "Logged out");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui" }}>
      <h1>🐻 Zustand Store Demo</h1>

      {/* Auth Section */}
      <section
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>🔐 Auth Store</h2>
        <p>
          Status:{" "}
          {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
        </p>
        {user && (
          <div style={{ marginBottom: "10px" }}>
            <p>
              <strong>User:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}
        <button
          onClick={isAuthenticated ? handleLogout : handleLogin}
          style={{
            padding: "10px 20px",
            backgroundColor: isAuthenticated ? "#f44336" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isAuthenticated ? "Logout" : "Login"}
        </button>
      </section>

      {/* UI Section */}
      <section
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>🎨 UI Store</h2>
        <div style={{ marginBottom: "15px" }}>
          <p>
            <strong>Theme:</strong> {theme}
          </p>
          <button
            onClick={toggleTheme}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Toggle Theme
          </button>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <p>
            <strong>Sidebar:</strong> {sidebarOpen ? "Open" : "Closed"}
          </p>
          <button
            onClick={toggleSidebar}
            style={{
              padding: "10px 20px",
              backgroundColor: "#9C27B0",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Toggle Sidebar
          </button>
        </div>
        <div>
          <button
            onClick={() =>
              openModal("Test Modal", <p>This is modal content!</p>)
            }
            style={{
              padding: "10px 20px",
              backgroundColor: "#FF9800",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Open Modal
          </button>
        </div>
      </section>

      {/* Notifications Section */}
      <section
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>🔔 Notifications Store</h2>
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() =>
              addNotification("success", "This is a success message!")
            }
            style={{
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Success
          </button>
          <button
            onClick={() =>
              addNotification("error", "This is an error message!")
            }
            style={{
              padding: "10px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Error
          </button>
          <button
            onClick={() =>
              addNotification("warning", "This is a warning message!")
            }
            style={{
              padding: "10px",
              backgroundColor: "#FF9800",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Warning
          </button>
          <button
            onClick={() => addNotification("info", "This is an info message!")}
            style={{
              padding: "10px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Info
          </button>
        </div>

        {/* Notification list */}
        <div>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: {
                  success: "#d4edda",
                  error: "#f8d7da",
                  warning: "#fff3cd",
                  info: "#d1ecf1",
                }[notification.type],
                color: {
                  success: "#155724",
                  error: "#721c24",
                  warning: "#856404",
                  info: "#0c5460",
                }[notification.type],
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {modal.isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{modal.title}</h2>
            <div style={{ marginBottom: "20px" }}>{modal.content}</div>
            <button
              onClick={closeModal}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
