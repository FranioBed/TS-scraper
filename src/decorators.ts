export function log(target: any, name: string, descriptor: any) {
    console.log(name + " was called.");
}