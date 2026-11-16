"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Construction, Clock, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const MaintainancePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
              >
                <Construction className="w-12 h-12 text-white" />
              </motion.div>
              
              <div className="space-y-2">
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Under Maintenance
                </CardTitle>
                <CardDescription className="text-lg text-slate-600 dark:text-slate-300">
                  We&apos;re working hard to improve your experience
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 dark:bg-slate-700/50 border border-blue-200 dark:border-slate-600">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    System Maintenance in Progress
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Our team is currently performing scheduled maintenance to enhance the system performance and add new features.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-indigo-50 dark:bg-slate-700/50 border border-indigo-200 dark:border-slate-600">
                <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                  <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    Estimated Time
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    We expect to be back online shortly. Thank you for your patience.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    variant="default"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  >
                    <Link href="/" className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Go to Homepage
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Link href="/programs/pgdm" className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Explore PGDM
                    </Link>
                  </Button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center pt-4"
              >
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  If you have any urgent inquiries, please contact us at{" "}
                  <a
                    href="mailto:info@immindia.edu.in"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    info@immindia.edu.in
                  </a>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </div>
    </div>
  );
};

export default MaintainancePage;
