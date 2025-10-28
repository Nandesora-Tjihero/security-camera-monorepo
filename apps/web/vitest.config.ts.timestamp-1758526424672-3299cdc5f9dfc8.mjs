// vitest.config.ts
import { defineConfig } from "file:///Users/nandesoratjihero/Documents/github/security-camera/node_modules/vitest/dist/config.js";
import { defineVitestProject } from "file:///Users/nandesoratjihero/Documents/github/security-camera/node_modules/@nuxt/test-utils/dist/config.mjs";
var vitest_config_default = defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["test/{e2e,unit}/*.{test,spec}.ts"],
          environment: "node"
        }
      },
      await defineVitestProject({
        test: {
          name: "nuxt",
          include: ["test/nuxt/*.{test,spec}.ts"],
          environment: "nuxt"
        }
      })
    ]
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9uYW5kZXNvcmF0amloZXJvL0RvY3VtZW50cy9naXRodWIvc2VjdXJpdHktY2FtZXJhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbmFuZGVzb3JhdGppaGVyby9Eb2N1bWVudHMvZ2l0aHViL3NlY3VyaXR5LWNhbWVyYS92aXRlc3QuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9uYW5kZXNvcmF0amloZXJvL0RvY3VtZW50cy9naXRodWIvc2VjdXJpdHktY2FtZXJhL3ZpdGVzdC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlc3QvY29uZmlnJztcbmltcG9ydCB7IGRlZmluZVZpdGVzdFByb2plY3QgfSBmcm9tICdAbnV4dC90ZXN0LXV0aWxzL2NvbmZpZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHRlc3Q6IHtcbiAgICBwcm9qZWN0czogW1xuICAgICAge1xuICAgICAgICB0ZXN0OiB7XG4gICAgICAgICAgbmFtZTogJ3VuaXQnLFxuICAgICAgICAgIGluY2x1ZGU6IFsndGVzdC97ZTJlLHVuaXR9Lyoue3Rlc3Qsc3BlY30udHMnXSxcbiAgICAgICAgICBlbnZpcm9ubWVudDogJ25vZGUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGF3YWl0IGRlZmluZVZpdGVzdFByb2plY3Qoe1xuICAgICAgICB0ZXN0OiB7XG4gICAgICAgICAgbmFtZTogJ251eHQnLFxuICAgICAgICAgIGluY2x1ZGU6IFsndGVzdC9udXh0Lyoue3Rlc3Qsc3BlY30udHMnXSxcbiAgICAgICAgICBlbnZpcm9ubWVudDogJ251eHQnLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgXSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4VixTQUFTLG9CQUFvQjtBQUMzWCxTQUFTLDJCQUEyQjtBQUVwQyxJQUFPLHdCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsSUFDSixVQUFVO0FBQUEsTUFDUjtBQUFBLFFBQ0UsTUFBTTtBQUFBLFVBQ0osTUFBTTtBQUFBLFVBQ04sU0FBUyxDQUFDLGtDQUFrQztBQUFBLFVBQzVDLGFBQWE7QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLE1BQ0EsTUFBTSxvQkFBb0I7QUFBQSxRQUN4QixNQUFNO0FBQUEsVUFDSixNQUFNO0FBQUEsVUFDTixTQUFTLENBQUMsNEJBQTRCO0FBQUEsVUFDdEMsYUFBYTtBQUFBLFFBQ2Y7QUFBQSxNQUNGLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
