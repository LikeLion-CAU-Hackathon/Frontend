export const stamps: string[] = Object.values(
  import.meta.glob("/src/assets/images/stamp/stamp*.svg", {
    eager: true,
    import: "default",
  })
);