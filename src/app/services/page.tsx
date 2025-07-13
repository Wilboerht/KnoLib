"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Brain, 
  Database, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Users,
  Cloud
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: BarChart3,
    title: "Advanced Analytics Platform",
    description: "Comprehensive data visualization and analytics platform with real-time dashboards, custom reporting, and interactive data exploration tools.",
    features: [
      "Real-time data processing",
      "Interactive dashboards",
      "Custom report builder",
      "Data visualization tools",
      "Automated insights"
    ],
    color: "blue"
  },
  {
    icon: Brain,
    title: "AI & Machine Learning",
    description: "Cutting-edge AI solutions including predictive analytics, natural language processing, and automated decision-making systems.",
    features: [
      "Predictive modeling",
      "Natural language processing",
      "Computer vision",
      "Automated ML pipelines",
      "AI-powered insights"
    ],
    color: "purple"
  },
  {
    icon: Database,
    title: "Data Integration & ETL",
    description: "Seamless data integration from multiple sources with robust ETL pipelines, data quality management, and real-time synchronization.",
    features: [
      "Multi-source integration",
      "Real-time ETL pipelines",
      "Data quality monitoring",
      "Schema management",
      "API connectivity"
    ],
    color: "green"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with end-to-end encryption, compliance management, and advanced access controls for enterprise environments.",
    features: [
      "End-to-end encryption",
      "SOC 2 compliance",
      "Role-based access control",
      "Audit logging",
      "Data governance"
    ],
    color: "red"
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description: "Scalable cloud infrastructure with auto-scaling, global deployment, and 99.9% uptime guarantee across multiple regions.",
    features: [
      "Auto-scaling infrastructure",
      "Global deployment",
      "99.9% uptime SLA",
      "Multi-region support",
      "Disaster recovery"
    ],
    color: "cyan"
  },
  {
    icon: Users,
    title: "Consulting & Support",
    description: "Expert consulting services, implementation support, and 24/7 technical assistance to ensure your success with our platform.",
    features: [
      "Implementation consulting",
      "24/7 technical support",
      "Training programs",
      "Best practices guidance",
      "Dedicated success manager"
    ],
    color: "orange"
  }
];

const colorClasses = {
  blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
  green: "text-green-600 bg-green-50 dark:bg-green-900/20",
  red: "text-red-600 bg-red-50 dark:bg-red-900/20",
  cyan: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20",
  orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20"
};

const industries = [
  { name: "Financial Services", description: "Risk management, fraud detection, regulatory compliance" },
  { name: "Healthcare", description: "Patient analytics, clinical research, operational efficiency" },
  { name: "Retail & E-commerce", description: "Customer insights, inventory optimization, personalization" },
  { name: "Manufacturing", description: "Predictive maintenance, quality control, supply chain optimization" },
  { name: "Technology", description: "Product analytics, user behavior, performance monitoring" },
  { name: "Government", description: "Public safety, resource allocation, citizen services" }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Container>
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Enterprise-Grade
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Data Solutions
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300">
              Comprehensive suite of data analytics, AI, and infrastructure services designed 
              to transform your business and accelerate growth.
            </p>
            <div className="mt-10">
              <Button size="lg" className="mr-4">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Schedule Consultation
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <Container>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              End-to-end solutions covering every aspect of your data journey, from collection 
              and processing to insights and action.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  className="p-8 bg-gray-50 dark:bg-slate-800 rounded-2xl hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colorClasses[service.color as keyof typeof colorClasses]} mb-6`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {service.description}
                  </p>

                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <Button variant="outline" size="sm">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Industries Section */}
      <section className="py-24 bg-gray-50 dark:bg-slate-800">
        <Container>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Industries We Serve
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our solutions are tailored to meet the unique challenges and requirements 
              of various industries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {industry.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {industry.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <Container>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Process
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A proven methodology that ensures successful implementation and maximum ROI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", description: "Understand your business needs and data landscape" },
              { step: "02", title: "Strategy", description: "Develop a comprehensive data strategy and roadmap" },
              { step: "03", title: "Implementation", description: "Deploy solutions with minimal disruption" },
              { step: "04", title: "Optimization", description: "Continuous monitoring and improvement" }
            ].map((phase, index) => (
              <motion.div
                key={phase.step}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {phase.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {phase.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {phase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <Container>
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to transform your data strategy?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how our services can help you unlock the full potential of your data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
