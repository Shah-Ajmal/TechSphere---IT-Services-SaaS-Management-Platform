import dotenv from "dotenv";
import connectDB from "../config/database.js";
import { User } from "../models/user.model.js";
import { Client } from "../models/client.model.js";
import { Service } from "../models/service.model.js";
import { Ticket } from "../models/ticket.model.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Client.deleteMany();
    await Service.deleteMany();
    await Ticket.deleteMany();

    console.log("📝 Data cleared");

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@techsphere.com",
      password: "admin123",
      role: "admin",
    });

    // Create regular user
    const user = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "user",
    });

    console.log("✅ Users created");

    // Create clients
    const clients = await Client.insertMany([
      {
        name: "Jane Smith",
        email: "jane@example.com",
        company: "Tech Corp",
        contactNumber: "1234567890",
        planType: "Premium",
        subscriptionStatus: "Active",
        createdBy: admin._id,
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        company: "Design Studio",
        contactNumber: "9876543210",
        planType: "Basic",
        subscriptionStatus: "Active",
        createdBy: admin._id,
      },
      {
        name: "Alice Williams",
        email: "alice@example.com",
        company: "Marketing Inc",
        contactNumber: "5555555555",
        planType: "Pro",
        subscriptionStatus: "Inactive",
        createdBy: admin._id,
      },
    ]);

    console.log("✅ Clients created");

    // Create services
    const services = await Service.insertMany([
      {
        name: "Cloud Hosting",
        description:
          "Reliable and scalable cloud hosting solutions for your business",
        price: 49,
        category: "Cloud Hosting",
        activeStatus: true,
        features: ["99.9% Uptime", "24/7 Support", "Auto Scaling"],
        icon: "cloud",
        createdBy: admin._id,
      },
      {
        name: "IT Monitoring",
        description: "24/7 system monitoring and alerting",
        price: 79,
        category: "Monitoring",
        activeStatus: true,
        features: [
          "Real-time Alerts",
          "Performance Metrics",
          "Custom Dashboards",
        ],
        icon: "server",
        createdBy: admin._id,
      },
      {
        name: "Security Tools",
        description: "Advanced security solutions to protect your data",
        price: 99,
        category: "Security",
        activeStatus: true,
        features: ["Firewall", "DDoS Protection", "SSL Certificates"],
        icon: "shield",
        createdBy: admin._id,
      },
      {
        name: "Database Management",
        description: "Professional database administration services",
        price: 129,
        category: "Database",
        activeStatus: true,
        features: ["Backup & Recovery", "Optimization", "Migration"],
        icon: "database",
        createdBy: admin._id,
      },
    ]);

    console.log("✅ Services created");

    // Create tickets
    const tickets = await Ticket.insertMany([
      {
        title: "Server downtime issue",
        description: "Our server has been down for the past 2 hours",
        priority: "High",
        status: "Open",
        category: "Technical",
        userId: user._id,
      },
      {
        title: "Password reset request",
        description: "Need help resetting my account password",
        priority: "Low",
        status: "In Progress",
        category: "General",
        userId: user._id,
        assignedTo: admin._id,
      },
      {
        title: "Billing inquiry",
        description: "Question about last month invoice",
        priority: "Medium",
        status: "Resolved",
        category: "Billing",
        userId: user._id,
        resolvedAt: new Date(),
      },
    ]);

    console.log("✅ Tickets created");

    console.log("\n🎉 Seed data created successfully!");
    console.log("\n📋 Test Credentials:");
    console.log("Admin:");
    console.log("  Email: admin@techsphere.com");
    console.log("  Password: admin123");
    console.log("\nUser:");
    console.log("  Email: john@example.com");
    console.log("  Password: password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
