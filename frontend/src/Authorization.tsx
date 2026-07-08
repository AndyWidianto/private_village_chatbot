import { Navigate } from "react-router";
import { useAuthStore } from "./lib/store/authStore";

export default function Authorization({ children } : { children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuthStore();

    return isAuthenticated ? user?.role === "user" ? <Navigate to={`/dashboard/${user?.id}`} /> : children : <Navigate to="/login" />
}