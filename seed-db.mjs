import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function seed() {
  console.log("Starting database seed...");

  const connection = await mysql.createConnection(DATABASE_URL);

  try {
    // Sample skills data
    const skillsData = [
      {
        name: "Python",
        description: "Python programming language for data science and backend development",
        category: "Programming",
        difficulty: "intermediate",
        demandTrend: "increasing",
        currentDemand: 92,
      },
      {
        name: "React",
        description: "JavaScript library for building user interfaces",
        category: "Frontend",
        difficulty: "intermediate",
        demandTrend: "increasing",
        currentDemand: 88,
      },
      {
        name: "Machine Learning",
        description: "ML algorithms and deep learning frameworks",
        category: "AI/ML",
        difficulty: "advanced",
        demandTrend: "increasing",
        currentDemand: 85,
      },
      {
        name: "Cloud Architecture",
        description: "AWS, Azure, GCP cloud infrastructure design",
        category: "DevOps",
        difficulty: "advanced",
        demandTrend: "increasing",
        currentDemand: 80,
      },
      {
        name: "TypeScript",
        description: "Typed superset of JavaScript",
        category: "Programming",
        difficulty: "intermediate",
        demandTrend: "stable",
        currentDemand: 75,
      },
      {
        name: "Docker",
        description: "Containerization platform",
        category: "DevOps",
        difficulty: "intermediate",
        demandTrend: "stable",
        currentDemand: 78,
      },
      {
        name: "Kubernetes",
        description: "Container orchestration platform",
        category: "DevOps",
        difficulty: "advanced",
        demandTrend: "increasing",
        currentDemand: 72,
      },
      {
        name: "GraphQL",
        description: "Query language for APIs",
        category: "Backend",
        difficulty: "intermediate",
        demandTrend: "increasing",
        currentDemand: 65,
      },
      {
        name: "Vue.js",
        description: "Progressive JavaScript framework",
        category: "Frontend",
        difficulty: "intermediate",
        demandTrend: "stable",
        currentDemand: 58,
      },
      {
        name: "Java",
        description: "Enterprise Java programming",
        category: "Programming",
        difficulty: "intermediate",
        demandTrend: "decreasing",
        currentDemand: 62,
      },
    ];

    console.log("Inserting skills...");
    for (const skill of skillsData) {
      const query = `INSERT INTO skills (name, description, category, difficulty, demandTrend, currentDemand, createdAt, updatedAt) 
                     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
      await connection.execute(query, [
        skill.name,
        skill.description,
        skill.category,
        skill.difficulty,
        skill.demandTrend,
        skill.currentDemand,
      ]);
    }
    console.log(`✓ Inserted ${skillsData.length} skills`);

    // Sample forecasts data
    const now = new Date();
    const forecastsData = [];

    // Generate forecasts for each skill
    for (let i = 0; i < skillsData.length; i++) {
      const skillId = i + 1;
      const baseMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      for (let month = 0; month < 12; month++) {
        const forecastDate = new Date(baseMonth);
        forecastDate.setMonth(baseMonth.getMonth() + month);

        const baseDemand = skillsData[i].currentDemand;
        const variance = Math.sin(month / 3) * 10;
        const trend = skillsData[i].demandTrend;

        let predictedDemand = baseDemand + variance;
        if (trend === "increasing") predictedDemand += month * 1.5;
        if (trend === "decreasing") predictedDemand -= month * 1.5;

        predictedDemand = Math.max(0, Math.min(100, Math.round(predictedDemand)));

        forecastsData.push({
          skillId,
          forecastDate,
          predictedDemand,
          confidence: (75 + Math.random() * 20).toFixed(2),
          trend: trend === "increasing" ? "increasing" : trend === "decreasing" ? "decreasing" : "stable",
          notes: `Forecast for ${skillsData[i].name} in month ${month + 1}`,
          createdBy: 1,
        });
      }
    }

    console.log("Inserting forecasts...");
    for (const forecast of forecastsData) {
      const query = `INSERT INTO forecasts (skillId, forecastDate, predictedDemand, confidence, trend, notes, createdBy, createdAt, updatedAt) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
      await connection.execute(query, [
        forecast.skillId,
        forecast.forecastDate,
        forecast.predictedDemand,
        forecast.confidence,
        forecast.trend,
        forecast.notes,
        forecast.createdBy,
      ]);
    }
    console.log(`✓ Inserted ${forecastsData.length} forecasts`);

    // Sample alerts data
    const alertsData = [
      {
        title: "High Demand Alert: Python",
        description: "Python demand has reached 92%, indicating strong market need",
        type: "threshold",
        severity: "high",
        skillId: 1,
        isRead: false,
        data: JSON.stringify({ threshold: 90, current: 92 }),
      },
      {
        title: "System Health Check",
        description: "Database backup completed successfully",
        type: "system",
        severity: "low",
        isRead: false,
        data: JSON.stringify({ status: "success", duration: "2m 34s" }),
      },
      {
        title: "Forecast Accuracy Update",
        description: "ML model accuracy improved to 94.2%",
        type: "forecast",
        severity: "medium",
        isRead: false,
        data: JSON.stringify({ accuracy: 94.2, previousAccuracy: 92.1 }),
      },
      {
        title: "Emerging Skill: AI Agents",
        description: "New skill trend detected - AI Agents gaining market traction",
        type: "user",
        severity: "medium",
        isRead: false,
        data: JSON.stringify({ trend: "emerging", growthRate: "35%" }),
      },
      {
        title: "Critical: Kubernetes Demand Surge",
        description: "Kubernetes demand spike detected - 25% increase in last 30 days",
        type: "threshold",
        severity: "critical",
        skillId: 7,
        isRead: false,
        data: JSON.stringify({ increase: "25%", period: "30 days" }),
      },
    ];

    console.log("Inserting alerts...");
    for (const alert of alertsData) {
      const query = `INSERT INTO alerts (title, description, type, severity, skillId, isRead, data, createdAt) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
      await connection.execute(query, [
        alert.title,
        alert.description,
        alert.type,
        alert.severity,
        alert.skillId || null,
        alert.isRead ? 1 : 0,
        alert.data,
      ]);
    }
    console.log(`✓ Inserted ${alertsData.length} alerts`);

    console.log("\n✅ Database seed completed successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
