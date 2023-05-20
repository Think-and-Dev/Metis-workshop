export function bytes32ToString(bytes32: string): string {
    const strippedBytes = bytes32.replace(/^0+/, '');

    const byteCharacters = strippedBytes.match(/.{1,2}/g);
    const byteValues = byteCharacters?.map((byte) => parseInt(byte, 16));

    const string = String.fromCharCode(...byteValues || []);

    return string || "";
}