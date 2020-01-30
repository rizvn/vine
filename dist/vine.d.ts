interface Subscription {
    (data: object): void;
}
interface Subscriptions {
    [key: string]: Subscription;
}
interface EventHandler {
    (eventData: any, globalData: any): any;
}
interface EventHandlers {
    [key: string]: EventHandler;
}
interface EventInterceptor {
    (eventName: String, eventData: any, data: any): void;
}
interface EventSubscribers {
    [key: string]: Array<string>;
}
export declare class Vine {
    subscribers: EventSubscribers;
    subscriberFunctions: Subscriptions;
    subscriberId: number;
    data: any;
    eventHandlers: EventHandlers;
    eventInterceptors: Array<(eventName: String, eventData: any, data: any) => void>;
    defaultEventHandler: EventHandler;
    getEventHandler(eventName: string): EventHandler;
    publish(eventName: string, eventData: any): void;
    fireSubscribedFunctions(eventName: string): void;
    subscribe(eventName: string, func: Subscription): string;
    unsubscribe(subscriberId: string): void;
    setEventHandler(eventName: string, handlerFunction: EventHandler): void;
    addEventInterceptor(interceptorFunction: EventInterceptor): void;
    getData(): any;
    setData(data: any): void;
    withData(callback: (data: any) => void): void;
}
export declare const vine: Vine;
export {};
