export enum ActionType {
    "INVOKE" = "Invoke",
    "CREATE" = "Create",
    "ASSIGN" = "Assign",
    "LOCK" = "Lock",
    "UNLOCK" = "Unlock",
    "RAISE_EVENT" ="Raise Event Action"

}

export enum ActionCategory {
    "TIMEOUT" = "Timeout Action",
    "ENTRY_ACTION" = "Entry Action",
    "EXIT_ACTION" = "Exit Action",
    "WHILE_ACTION" = "While Action"
}


/**
 * This enum is used for describing the various valid service types related to the ActionType Invoke.
 */
export enum ServiceType {
    "REMOTE" ="Remote",
    "LOCAL" ="Local"
}

/**
 * This enum is used for describing the various valid service levels related to the ActionType Invoke.
 */
export enum ServiceLevel {
    "INSTANCE" ="Instance",
    "GLOBAL" = "Global"
}

/**
 * This enum is used for describing the duration of Invoke actions
 */
export enum Duration {
    "MILLISECONDS" = "ms",
    "SECONDS"= "s",
    "MINUTES" = "min",
    "HOURS" = "hh",
}

/**
 * This enum is used for describing the memory requirements of Invoke actions
 */
export enum Memory {
    "BYTES"="B",
    "KILOBYTES" = "KB",
    "MEGABYTES" = "MB",
    "GIGABYTES" = "GB"
 }




