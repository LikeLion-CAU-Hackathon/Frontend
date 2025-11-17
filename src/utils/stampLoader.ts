const stampModules = import.meta.glob("/src/assets/images/stamp/stamp*.png", {
  eager: true,
  import: "default",
});

// 파일명에서 숫자를 추출하여 숫자 순으로 정렬
export const stamps: string[] = Object.entries(stampModules)
  .sort(([pathA], [pathB]) => {
    const numA = parseInt(pathA.match(/stamp(\d+)\.png/)?.[1] || "0", 10);
    const numB = parseInt(pathB.match(/stamp(\d+)\.png/)?.[1] || "0", 10);
    return numA - numB; // 숫자 순으로 정렬
  })
  .map(([, value]) => value as string);