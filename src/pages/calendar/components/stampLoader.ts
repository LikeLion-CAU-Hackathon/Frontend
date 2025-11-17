export const stamps: string[] = Object.values(
  import.meta.glob("/src/assets/images/stamp/stamp*.png", {
    eager: true,
    import: "default",
  })
);