// Declare keypress module for supressing TypeScript errors:
declare module 'keypress' {
    export default function keypress(stream: NodeJS.ReadStream): void;
}