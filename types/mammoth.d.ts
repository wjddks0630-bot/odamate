// mammoth는 타입 정의를 제공하지 않아, 우리가 쓰는 부분만 선언한다.
declare module "mammoth/mammoth.browser" {
  export function extractRawText(input: {
    arrayBuffer: ArrayBuffer;
  }): Promise<{ value: string; messages: unknown[] }>;
}
