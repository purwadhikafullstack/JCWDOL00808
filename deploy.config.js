module.exports = {
  apps: [
    {
      name: "JCWDOL-008-08", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8808,
      },
      time: true,
    },
  ],
};
