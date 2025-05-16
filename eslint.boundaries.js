import boundaries from "eslint-plugin-boundaries";

export const eslintBoundariesConfig = {
  plugins: {
    boundaries,
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },

    "boundaries/elements": [
      {
        type: "app",
        pattern: "./src/app",
      },
      {
        type: "features",
        pattern: "./src/features/*",
      },
      {
        type: "shared",
        pattern: "./src/shared",
      },
    ],
  },
  rules: {
    "boundaries/element-types": [
      2,
      {
        default: "allow",
        rules: [
          {
            from: "shared",
            disallow: ["app", "features"],
            message:
              "Модуль нижчого рівня (${file.type}) не може імпортувати модуль вищого рівня (${dependency.type})",
          },
          {
            from: "features",
            disallow: ["app"],
            message:
              "Модуль нижчого шару (${file.type}) не може імпортувати модуль вищого шару (${dependency.type})",
          },
        ],
      },
    ],
    "boundaries/entry-point": [
      2,
      {
        default: "disallow",
        message:
          "Модуль (${file.type}) повинен імпортуваться через public API. Прямий імпорт з ${dependency.source} заборонений.",

        rules: [
          {
            target: ["shared", "app"],
            allow: "**",
          },
          {
            target: ["features"],
            allow: ["index.(ts|tsx)", "*.page.tsx"],
          },
        ],
      },
    ],
  },
};
