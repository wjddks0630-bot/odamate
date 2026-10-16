// 화면 맨 위 막대: 왼쪽에 재정경제부 로고, 오른쪽에는 필요한 버튼(로그아웃 등)을 둔다.
// 로고는 배경이 투명한 그림이라, 어두운 화면에서도 글자가 보이도록 흰 바탕 위에 올린다.
// onHome을 넘기면 로고를 눌러 처음 화면으로 돌아갈 수 있다.
import Image from "next/image";
import type { ReactNode } from "react";

export default function TopBar({ children, onHome }: { children?: ReactNode; onHome?: () => void }) {
  const logo = (
    <Image
      src="/mofe-logo.png"
      alt="재정경제부"
      width={2000}
      height={633}
      priority
      className="h-8 w-auto sm:h-10"
    />
  );

  return (
    <div className="flex items-center justify-between px-4 pt-4 sm:px-6">
      {onHome ? (
        <button
          type="button"
          onClick={onHome}
          aria-label="처음 화면으로"
          className="inline-flex cursor-pointer rounded-md bg-white px-2 py-1"
        >
          {logo}
        </button>
      ) : (
        <span className="inline-flex rounded-md bg-white px-2 py-1">{logo}</span>
      )}
      <div>{children}</div>
    </div>
  );
}
