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
