// event.test.ts
import Event from "../src/classes/event";
import {EventDescription} from "../src/pkl/bindings/collaborative_state_machine_description.pkl";
import ContextVariable from "../src/classes/contextVariable";
import {EventChannel} from "../src/enums";

describe("Event Class", () => {
    describe("toDescription Method", () => {
        it("should convert Event to EventDescription correctly", () => {
            const event = new Event("TestEvent", EventChannel.INTERNAL);
            const contextVariable = new ContextVariable("variable1", "value1");
            event.addContextVariable(contextVariable);

            const description = event.toDescription();

            expect(description).toEqual({
                name: "TestEvent",
                channel: "internal",
                data: [
                    {
                        name: "variable1",
                        value: "value1",
                    },
                ],
            });
        });

        it("should handle empty data in Event", () => {
            const event = new Event("EmptyDataEvent", EventChannel.EXTERNAL);

            const description = event.toDescription();

            expect(description).toEqual({
                name: "EmptyDataEvent",
                channel: "external",
                data: [],
            });
        });

        it("should handle special characters in Event name", () => {
            const event = new Event("Special!@#Event", EventChannel.GLOBAL);
            const contextVariable = new ContextVariable("var!@#", "val!@#");
            event.addContextVariable(contextVariable);

            const description = event.toDescription();

            expect(description).toEqual({
                name: "Special!@#Event",
                channel: "global",
                data: [
                    {
                        name: "var!@#",
                        value: "val!@#",
                    },
                ],
            });
        });

        it("should handle all event channels", () => {
            const channels: EventChannel[] = [EventChannel.INTERNAL, EventChannel.EXTERNAL, EventChannel.GLOBAL, EventChannel.PERIPHERAL];

            channels.forEach((channel) => {
                const event = new Event("ChannelTestEvent", channel);
                const description = event.toDescription();

                expect(description.channel).toBe(channel);
            });
        });

        it("should handle multiple context variables", () => {
            const event = new Event("MultiContextEvent", EventChannel.PERIPHERAL);
            event.addContextVariable(new ContextVariable("var1", "val1"));
            event.addContextVariable(new ContextVariable("var2", "val2"));

            const description = event.toDescription();

            expect(description).toEqual({
                name: "MultiContextEvent",
                channel: "peripheral",
                data: [
                    { name: "var1", value: "val1" },
                    { name: "var2", value: "val2" },
                ],
            });
        });
    });

    describe("fromDescription Method", () => {
        it("should convert EventDescription to Event correctly", () => {
            const description: EventDescription = {
                name: "TestEventFromDescription",
                channel: "internal",
                data: [
                    { name: "variable1", value: "value1" },
                    { name: "variable2", value: "value2" },
                ],
            };

            const event = Event.fromDescription(description);

            expect(event).toBeInstanceOf(Event);
            expect(event.name).toBe("TestEventFromDescription");
            expect(event.channel).toBe("internal");
            expect(event.data).toHaveLength(2);
            expect(event.data[0]).toBeInstanceOf(ContextVariable);
            expect(event.data[0].name).toBe("variable1");
            expect(event.data[0].value).toBe("value1");
            expect(event.data[1].name).toBe("variable2");
            expect(event.data[1].value).toBe("value2");
        });

        it("should handle empty data array in EventDescription", () => {
            const description: EventDescription = {
                name: "EmptyDataEventFromDescription",
                channel: "external",
                data: [],
            };

            const event = Event.fromDescription(description);

            expect(event).toBeInstanceOf(Event);
            expect(event.name).toBe("EmptyDataEventFromDescription");
            expect(event.channel).toBe("external");
            expect(event.data).toEqual([]);
        });

        it("should handle special characters in EventDescription", () => {
            const description: EventDescription = {
                name: "Special!@#EventFromDescription",
                channel: "global",
                data: [{ name: "var!@#", value: "val!@#" }],
            };

            const event = Event.fromDescription(description);

            expect(event).toBeInstanceOf(Event);
            expect(event.name).toBe("Special!@#EventFromDescription");
            expect(event.channel).toBe("global");
            expect(event.data).toHaveLength(1);
            expect(event.data[0].name).toBe("var!@#");
            expect(event.data[0].value).toBe("val!@#");
        });

        it("should handle all event channels when converting from description", () => {
            const channels: EventChannel[] = [EventChannel.INTERNAL, EventChannel.EXTERNAL, EventChannel.GLOBAL, EventChannel.PERIPHERAL];

            channels.forEach((channel) => {
                const description: EventDescription = {
                    name: "ChannelTestEventFromDescription",
                    channel: channel,
                    data: [],
                };

                const event = Event.fromDescription(description);

                expect(event.channel).toBe(channel);
            });
        });

        it("should handle complex context variable data", () => {
            const description: EventDescription = {
                name: "ComplexDataEvent",
                channel: "peripheral",
                data: [
                    { name: "complexVar1", value: "complexValue1" },
                    { name: "complexVar2", value: "complexValue2" },
                ],
            };

            const event = Event.fromDescription(description);

            expect(event).toBeInstanceOf(Event);
            expect(event.name).toBe("ComplexDataEvent");
            expect(event.channel).toBe("peripheral");
            expect(event.data).toHaveLength(2);
            expect(event.data[0].name).toBe("complexVar1");
            expect(event.data[0].value).toBe("complexValue1");
            expect(event.data[1].name).toBe("complexVar2");
            expect(event.data[1].value).toBe("complexValue2");
        });
    });
});
