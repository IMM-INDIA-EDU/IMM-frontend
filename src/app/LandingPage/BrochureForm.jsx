"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
const pgdm = "/assets/pdfs/Brochure 2026-28.pdf";
import { API_ENDPOINTS } from "@/lib/api";

export default function BrochureForm({ 
  open: externalOpen, 
  onOpenChange: externalOnOpenChange,
  showTrigger = true 
}) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    state: "",
  });
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // Use external state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalOnOpenChange || setInternalOpen;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const phpRequest = fetch(`${API_ENDPOINTS.API}/indexBrochure.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then(async (res) => {
        let data = null;
        try {
          data = await res.json();
        } catch (e) {
          data = null;
        }
        return { ok: res.ok, status: res.status, data };
      });

      const emailRequest = fetch(`/next-api/brochure-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then(async (res) => {
        let data = null;
        try {
          data = await res.json();
        } catch (e) {
          data = null;
        }
        return { ok: res.ok, status: res.status, data };
      });

      const [phpOutcome, emailOutcome] = await Promise.allSettled([
        phpRequest,
        emailRequest,
      ]);

      let phpOk = false;
      let phpMessage = "";
      if (phpOutcome.status === "fulfilled") {
        phpOk = phpOutcome.value.ok;
        phpMessage =
          (phpOutcome.value.data && phpOutcome.value.data.message) ||
          (phpOk ? "Submitted successfully." : "An error occurred.");
      } else {
        phpOk = false;
        phpMessage =
          "Failed to connect to the server. Check console for details.";
        console.error("PHP API error:", phpOutcome.reason);
      }

      if (emailOutcome.status === "rejected") {
        console.warn("Email API request failed:", emailOutcome.reason);
      } else if (!emailOutcome.value.ok) {
        console.warn("Email API responded with error:", emailOutcome.value);
      }

      if (phpOk) {
        setSubmitMessage({ type: "success", text: phpMessage });
        setIsOpen(false);
        window.open(pgdm, "_blank");
        setFormData({
          name: "",
          mobile: "",
          email: "",
          state: "",
        });
      } else {
        setSubmitMessage({ type: "error", text: phpMessage });
      }
    } catch (err) {
      console.error("Brochure form submission error:", err);
      setSubmitMessage({
        type: "error",
        text: "Failed to connect to the server. Check console for details.",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <button
            className={`flex items-center rotate-[270deg] bg-red-800 hover:bg-pink-900 text-white px-4 pt-2 pb-5 rounded-lg drop-shadow-lg transition-all duration-300 animate-pulse font-semibold`}
          >
            Download Brochure
          </button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg w-[95%]">
        <DialogHeader>
          <DialogTitle className="text-pink-800 flex items-center justify-between px-4">
            Download PGDM Brochure
            <Image
              src="/logo.svg"
              alt="PGDM Brochure"
              width={48}
              height={48}
              className="w-auto h-12 mr-2 p-1 bg-pink-900 rounded-sm"
            />
          </DialogTitle>
          {/* {submitMessage && (
            <p
              className={`text-sm ml-4 mt-2 ${
                submitMessage.type === "error"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {submitMessage.text}
            </p>
          )} */}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-5 sm:gap-4 py-4">
          <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="name" className="sm:text-right text-pink-800">
              <User className="inline-block mr-2 h-5 w-5 text-pink-800" />
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3 border-pink-300 focus:border-pink-500"
              required
            />
          </div>
          <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="mobile" className="sm:text-right text-pink-800">
              <Phone className="inline-block mr-2 h-5 w-5 text-pink-800" />
              Mobile
            </Label>
            <Input
              id="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              className="col-span-3 border-pink-300 focus:border-pink-500"
              required
            />
          </div>
          <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="email" className="sm:text-right text-pink-800">
              <Mail className="inline-block mr-2 h-5 w-5 text-pink-800" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3 border-pink-300 focus:border-pink-500"
              required
            />
          </div>
          <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
            <Label htmlFor="state" className="sm:text-right text-pink-800">
              <MapPin className="inline-block mr-2 h-5 w-5 text-pink-800" />
              State
            </Label>
            <Input
              id="state"
              value={formData.state}
              onChange={handleChange}
              className="col-span-3 border-pink-300 focus:border-pink-500"
              required
            />
          </div>
          <DialogFooter className="flex justify-between gap-3 sm:gap-0">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="text-pink-800 border-pink-800 hover:bg-pink-50"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-pink-800 hover:bg-pink-900 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit & Download"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
