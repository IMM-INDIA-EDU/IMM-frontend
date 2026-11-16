"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import api, { API_ENDPOINTS } from "@/lib/api"

// Form validation schema
const formSchema = z.object({
  fullname: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .regex(/^[A-Za-z ]+$/, {
      message: "Name can only contain letters and spaces.",
    }),
  contact: z.string().regex(/^[6-9][0-9]{9}$/, {
    message: "Please enter a valid 10-digit contact number starting with 6, 7, 8, or 9.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  address: z.string().min(2, {
    message: "Please enter your city.",
  }),
  completed12th: z.enum(["yes", "no"], {
    required_error: "Please select an option.",
  }),
})

const EnquiryForm = ({ toggleForm, onSuccess }) => {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMarksheetUpload, setShowMarksheetUpload] = useState(false)
  const [isEligible, setIsEligible] = useState(true)
  const [file, setFile] = useState(null)

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      contact: "",
      email: "",
      address: "",
      completed12th: undefined,
    },
  })

  // Handle form submission
  const onSubmit = async (values) => {
    setIsSubmitting(true)

    // Create FormData for file upload
    const formData = new FormData()
    formData.append("fullname", values.fullname)
    formData.append("contact", values.contact)
    formData.append("email", values.email)
    formData.append("address", values.address)
    formData.append("course", "BBA")
    formData.append("completed12th", values.completed12th)

    // Only append file if one exists
    if (file) {
      formData.append("file", file)
    }

    try {
      // Submit to both PHP API and email API in parallel
      const phpRequest = api.post(API_ENDPOINTS.BBA, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const emailRequest = fetch("/next-api/bba-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: values.fullname,
          contact: values.contact,
          email: values.email,
          address: values.address,
          course: "BBA",
          completed12th: values.completed12th,
          hasFile: !!file
        }),
      }).then(async (res) => {
        let data = null
        try {
          data = await res.json()
        } catch (e) {
          data = null
        }
        return { ok: res.ok, status: res.status, data }
      })

      const [phpOutcome, emailOutcome] = await Promise.allSettled([
        phpRequest,
        emailRequest,
      ])

      let phpOk = false
      let phpMessage = "There was a problem with your request."
      if (phpOutcome.status === "fulfilled") {
        const val = phpOutcome.value
        phpOk = Boolean(val.data && val.data.success)
        phpMessage = (val.data && val.data.message) || phpMessage
      } else {
        console.error("BBA PHP API error:", phpOutcome.reason)
      }

      if (emailOutcome.status === "rejected") {
        console.warn("BBA email API failed:", emailOutcome.reason)
      } else if (!emailOutcome.value.ok) {
        console.warn(
          "BBA email API responded with error:",
          emailOutcome.value
        )
      }

      if (phpOk) {
        toast({
          title: "Success",
          description: "BBA application submitted successfully!",
        })
        
        // Reset form and show success message
        form.reset()
        setFile(null)
        setShowMarksheetUpload(false)
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: phpMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle eligibility change
  const handleEligibilityChange = (value) => {
    if (value === "yes") {
      setShowMarksheetUpload(true)
      setIsEligible(true)
    } else {
      setShowMarksheetUpload(false)
      setIsEligible(false)
      alert("Sorry, you are not eligible.")
    }
  }

  // Handle file change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <Card className="bg-white border-0 shadow-xl text-foreground">
      <CardHeader className="text-white bg-blue-700 rounded-t-lg">
        <div className="flex gap-2 justify-between items-start">
          <CardTitle className="font-bold text-center sm:text-xl">Register for Admission 2025-2028</CardTitle>
          <button onClick={toggleForm} className="text-white hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <CardDescription className="text-sm text-blue-100 sm:text-base">Fill the form below to start your application</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      placeholder="Enter Contact Number"
                      maxLength={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mb-4">
              <Input value="BBA" readOnly className="bg-gray-50" />
            </div>

            <FormField
              control={form.control}
              name="completed12th"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you have minimum 50% score in 10th and 12th?</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleEligibilityChange(value)
                    }}
                    value={field.value}
                    disabled={!isEligible && field.value === "no"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Yes or No" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showMarksheetUpload && (
              <div className="mb-4 space-y-2">
                <label className="text-sm font-medium">Upload your 12th Marksheet</label>
                <Input
                  type="file"
                  accept=".pdf, .doc, .docx"
                  onChange={handleFileChange}
                  disabled={!isEligible}
                  className="px-2 h-12 file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-sm text-gray-500">Accepted formats: PDF, DOC, DOCX</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800"
              disabled={isSubmitting || !isEligible}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default EnquiryForm
