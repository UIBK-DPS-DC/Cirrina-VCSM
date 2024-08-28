
export enum ActionType {
    "INVOKE" = "invoke",
    "CREATE" = "create",
    "ASSIGN" = "assign",
    "LOCK" = "lock",
    "UNLOCK" = "unlock",
    "RAISE_EVENT" = "raise",
    "TIMEOUT" = "timeout",
    "TIMEOUT_RESET" = "timeoutReset"
}





export enum EventChannel {
        "INTERNAL" = "internal",
        "EXTERNAL" = "external",
        "GLOBAL" = "global",
        "PERSONAL" = "peripheral",
}


// TODO: Restructure types. Maybe just use pkl bindings
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
export enum TimeUnit {
    "MILLISECONDS" = "ms",
    "SECONDS"= "s",
    "MINUTES" = "min",
    "HOURS" = "h",
}

/**
 * This enum is used for describing the memory requirements of Invoke actions
 */
export enum MemoryUnit {
    "BYTES"="B",
    "KILOBYTES" = "KB",
    "MEGABYTES" = "MB",
    "GIGABYTES" = "GB"
 }




