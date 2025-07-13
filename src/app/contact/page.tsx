"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  MessageIcon,
  SupportIcon,
  PartnersIcon,
  EmailIcon,
  PhoneIcon,
  ClockIcon,
  SendIcon
} from "@/components/ui/icons";


const contactMethods = [
  {
    icon: MessageIcon,
    title: "Knowledge Sharing",
    description: "Learn how KnoLib can help with your personal knowledge management",
    contact: "hello@knolib.com",
    action: "Start Sharing"
  },
  {
    icon: SupportIcon,
    title: "Technical Support",
    description: "Technical support for KnoLib platform users",
    contact: "support@knolib.com",
    action: "Get Support"
  },
  {
    icon: PartnersIcon,
    title: "Collaboration",
    description: "Explore collaboration and knowledge sharing opportunities",
    contact: "partners@knolib.com",
    action: "Collaborate"
  }
];

// Personal platform - no physical offices needed

export default function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50/80 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-sm">
        <Container>
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Connect with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                KnoLib
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300">
              Ready to transform your organization&apos;s knowledge sharing? Our team of experts is here to help you
              unlock the full potential of collaborative learning and enterprise knowledge management.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.title}
                  className="text-center p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-white/20 dark:border-slate-700/30 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100/50 dark:border-blue-800/30">
                    <Icon className="w-8 h-8 text-gray-900 dark:text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {method.description}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-6">
                    {method.contact}
                  </p>
                  <Button variant="outline" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    {method.action}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 bg-gradient-to-br from-gray-50/80 via-white/50 to-blue-50/30 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-900/30 backdrop-blur-sm">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-white/20 dark:border-slate-700/30 p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Start Your Knowledge Journey
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your Company"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="">Select a subject</option>
                    <option value="knowledge-sharing">Knowledge Sharing Platform</option>
                    <option value="enterprise-demo">Enterprise Demo Request</option>
                    <option value="integration">System Integration</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="training">Training & Onboarding</option>
                    <option value="other">Other</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your knowledge sharing goals and how KnoLib can help transform your organization..."
                    className="resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  Send Message
                  <SendIcon className="ml-2 h-4 w-4" size={16} />
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-white/20 dark:border-slate-700/30 p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Get in Touch
              </h2>

              <div className="space-y-6 mb-12">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100/50 dark:border-blue-800/30">
                    <EmailIcon className="w-6 h-6 text-gray-900 dark:text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">hello@knolib.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100/50 dark:border-blue-800/30">
                    <PhoneIcon className="w-6 h-6 text-gray-900 dark:text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100/50 dark:border-blue-800/30">
                    <ClockIcon className="w-6 h-6 text-gray-900 dark:text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Support Hours</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                      24/7 Support for Enterprise customers
                    </p>
                  </div>
                </div>
              </div>

              {/* Platform Info */}
              <div className="bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm rounded-lg border border-white/30 dark:border-slate-600/30 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  About KnoLib
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  KnoLib is a personal knowledge sharing platform created to help individuals
                  organize, share, and grow their knowledge. Built with passion for learning
                  and sharing insights with the community.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Contact our support team for personalized assistance.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "How do I get started with KnoLib?",
                answer: "Getting started with KnoLib is simple! Just browse the knowledge base, explore the articles, and start learning. You can access most content without registration and begin building your personal knowledge journey immediately."
              },
              {
                question: "Can I contribute my own knowledge to KnoLib?",
                answer: "Absolutely! KnoLib encourages knowledge sharing. You can contribute articles, share insights, and help build the community knowledge base. Contact us to learn more about becoming a contributor."
              },
              {
                question: "What kind of content can I find on KnoLib?",
                answer: "KnoLib features a wide range of content including technical tutorials, learning guides, best practices, and personal insights. The platform covers various topics to support continuous learning and professional development."
              },
              {
                question: "Is KnoLib free to use?",
                answer: "Yes, KnoLib is free to access and use. Most content is available without registration, making it easy to start your learning journey and explore the knowledge base."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="mb-8 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-lg border border-white/20 dark:border-slate-700/30 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
