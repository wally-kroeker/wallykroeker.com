type Status = "Active" | "Paused" | "Completed";

interface StatusBadgeProps {
    status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const styles = {
        Active: "bg-green-500/10 text-green-400 border-green-500/20",
        Paused: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        Completed: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    };

    return (
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${styles[status]}`}>
            {status}
        </span>
    );
}
