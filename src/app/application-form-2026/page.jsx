'use client'

import React, { useState, useEffect } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Check, ChevronRight, User, Phone, GraduationCap, Briefcase, FileText, CreditCard } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

// Zod Validation Schemas
const step1Schema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  nationality: z.string().optional(),
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Aadhaar number must be exactly 12 digits'),
})

const step2Schema = z.object({
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, 'Mobile number must be 10 digits starting with 6-9'),
  alternateMobileNumber: z.string().optional().refine((val) => {
    if (!val || val === '') return true
    return /^[6-9]\d{9}$/.test(val)
  }, 'Alternate mobile number must be 10 digits starting with 6-9'),
  email: z.string().email('Please enter a valid email address'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  fathersName: z.string().optional(),
  fathersMobileNumber: z.string().optional().refine((val) => {
    if (!val || val === '') return true
    return /^[6-9]\d{9}$/.test(val)
  }, "Father's mobile number must be 10 digits starting with 6-9"),
  fathersOccupation: z.string().optional(),
  annualFamilyIncome: z.string().optional(),
})

const step3Schema = z.object({
  tenthBoard: z.string().min(1, '10th Board is required'),
  tenthPercentage: z.string().min(1, '10th Percentage/CGPA is required'),
  twelfthBoard: z.string().min(1, '12th Board is required'),
  twelfthYear: z.string().regex(/^(19|20)\d{2}$/, 'Please enter a valid year').refine((val) => {
    const year = parseInt(val)
    return year >= 1980 && year <= 2026
  }, 'Year must be between 1980 and 2026'),
  twelfthPercentage: z.string().min(1, '12th Percentage/CGPA is required'),
  graduationDegree: z.string().min(1, 'Graduation degree is required'),
  graduationYear: z.string().regex(/^(19|20)\d{2}$/, 'Please enter a valid year'),
  graduationPercentage: z.string().min(1, 'Graduation percentage/CGPA is required'),
  entranceExamName: z.string().optional(),
  entranceExamScore: z.string().optional(),
})

const step4Schema = z.object({
  // Payment step - no validation needed, just display bank details
})

const step5Schema = z.object({
  hasWorkExperience: z.enum(['Yes', 'No'], { required_error: 'Please select an option' }),
  organizationName: z.string().optional(),
  designation: z.string().optional(),
  duration: z.string().optional(),
  natureOfWork: z.string().optional(),
  specialization: z.string().min(1, 'Please select a specialization'),
}).refine((data) => {
  if (data.hasWorkExperience === 'Yes') {
    return data.organizationName && data.designation && data.duration && data.natureOfWork
  }
  return true
}, {
  message: 'All work experience fields are required when work experience is Yes',
  path: ['organizationName'],
})

const step6Schema = z.object({
  declaration: z.boolean().refine((val) => val === true, 'You must accept the declaration'),
})

// Helper function to get current step schema
const getCurrentStepSchema = (step) => {
  switch (step) {
    case 1: return step1Schema
    case 2: return step2Schema
    case 3: return step3Schema
    case 4: return step4Schema
    case 5: return step5Schema
    case 6: return step6Schema
    default: return step1Schema
  }
}

// Simple Progress Component
const Progress = ({ value, className }) => {
  return (
    <div className={cn('w-full h-2 bg-gray-200 rounded-full overflow-hidden', className)}>
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}

// Simple Checkbox Component
const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className={cn(
          'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500',
          className
        )}
        {...props}
      />
    </div>
  )
})
Checkbox.displayName = 'Checkbox'

// Stepper Component
const Stepper = ({ currentStep, completedSteps, onStepClick }) => {
  const steps = [
    { number: 1, title: 'Personal', icon: User },
    { number: 2, title: 'Contact', icon: Phone },
    { number: 3, title: 'Academic', icon: GraduationCap },
    { number: 4, title: 'Payment', icon: CreditCard },
    { number: 5, title: 'Work & Course', icon: Briefcase },
    { number: 6, title: 'Declaration', icon: FileText },
  ]

  return (
    <div className="w-full mb-8">
      <Progress value={(currentStep / 6) * 100} className="mb-8" />
      <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-between gap-4 md:gap-0">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = completedSteps.includes(step.number)
          const isCurrent = currentStep === step.number
          const isUpcoming = currentStep < step.number

          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4 flex-1">
                <button
                  type="button"
                  onClick={() => isCompleted && onStepClick(step.number)}
                  disabled={!isCompleted && !isCurrent}
                  className={cn(
                    'flex flex-col md:flex-row items-center gap-2 transition-all w-full md:w-auto',
                    isCompleted && 'cursor-pointer hover:scale-105',
                    !isCompleted && !isCurrent && 'cursor-not-allowed'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center min-w-12 h-12 rounded-full border-2 transition-all',
                      isCompleted && 'bg-green-500 border-green-500 text-white',
                      isCurrent && 'bg-blue-500 border-blue-500 text-white animate-pulse',
                      isUpcoming && 'bg-gray-100 border-gray-300 text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{step.number}</span>
                    )}
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs text-gray-500 hidden md:block">Step {step.number}</p>
                    <p className={cn(
                      'font-medium text-sm',
                      isCurrent && 'text-blue-600',
                      isCompleted && 'text-green-600',
                      isUpcoming && 'text-gray-400'
                    )}>
                      {step.title}
                    </p>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'hidden md:block w-full h-0.5 mx-2 transition-colors',
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  )} />
                )}
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

// Step 1: Personal Details
const Step1Personal = () => {
  const { control } = useFormContext()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Personal Details</h2>
        <p className="text-gray-600">Please provide your personal information</p>
      </div>

      <FormField
        control={control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-row gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="nationality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nationality</FormLabel>
            <FormControl>
              <Input placeholder="Enter your nationality (optional)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="aadhaarNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Aadhaar Number <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter 12-digit Aadhaar number"
                maxLength={12}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

// Step 2: Contact & Parent Details
const Step2Contact = () => {
  const { control } = useFormContext()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Contact & Parent Details</h2>
        <p className="text-gray-600">Please provide your contact and parent information</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        
        <FormField
          control={control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="alternateMobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternate Mobile Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Enter alternate mobile number (optional)"
                  maxLength={10}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email ID <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter your city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter your state" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Parent/Guardian Information</h3>

        <FormField
          control={control}
          name="fathersName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Father's Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter father's name (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="fathersMobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Father's Mobile Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Enter father's mobile number (optional)"
                  maxLength={10}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="fathersOccupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Father's Occupation</FormLabel>
              <FormControl>
                <Input placeholder="Enter father's occupation (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="annualFamilyIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Family Income</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter annual family income (optional)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

// Step 3: Academic Qualifications
const Step3Academic = () => {
  const { control } = useFormContext()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Academic Qualifications</h2>
        <p className="text-gray-600">Please provide your academic details</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">10th Details</h3>
        
        <FormField
          control={control}
          name="tenthBoard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>10th Board <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter 10th board name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="tenthPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>10th Percentage/CGPA <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter percentage or CGPA"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">12th Details</h3>

        <FormField
          control={control}
          name="twelfthBoard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>12th Board <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter 12th board name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="twelfthYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>12th Year of Passing <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="YYYY (e.g., 2020)"
                    maxLength={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="twelfthPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>12th Percentage/CGPA <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter percentage or CGPA"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Graduation</h3>

        <FormField
          control={control}
          name="graduationDegree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Graduation Degree <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Enter graduation degree" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="graduationYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Graduation Year of Passing <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="YYYY (e.g., 2023)"
                    maxLength={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="graduationPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Graduation Percentage/CGPA <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter percentage or CGPA"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Entrance Exam (Optional)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="entranceExamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter exam name (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="entranceExamScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Score/Percentile</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter score/percentile (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}

// Step 4: Payment Details
const Step4Payment = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Details</h2>
        <p className="text-gray-600">Please review the payment information</p>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl">Bank Details for Payment</CardTitle>
          <CardDescription>Please transfer the application fee via Online Bank Transfer / NEFT / RTGS to the following account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Account Name</p>
              <p className="text-base font-semibold text-gray-900">Institute of Marketing and Management</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Current Account Number</p>
              <p className="text-base font-semibold text-gray-900 font-mono">705018076</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">IFSC Code</p>
              <p className="text-base font-semibold text-gray-900 font-mono">IDIB000M089</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Bank Name</p>
              <p className="text-base font-semibold text-gray-900">Indian Bank</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-600 mb-1">Branch</p>
              <p className="text-base font-semibold text-gray-900">MIA Branch, New Delhi – 110016</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-center">Scan QR Code for UPI Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-white shadow-sm">
              <Image
                src="/imm-qr.png"
                alt="Indian Bank QR Code for UPI Payment"
                fill
                className="object-contain p-2"
                priority
              />
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Scan this QR code with any UPI app to make payment directly
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Step 5: Work Experience & Course
const Step5WorkCourse = () => {
  const { control, watch } = useFormContext()
  const hasWorkExperience = watch('hasWorkExperience')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Work Experience & Course Preference</h2>
        <p className="text-gray-600">Please provide your work experience and course details</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Work Experience</h3>

        <FormField
          control={control}
          name="hasWorkExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Do you have work experience? <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-row gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="work-yes" />
                    <Label htmlFor="work-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="work-no" />
                    <Label htmlFor="work-no">No</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasWorkExperience === 'Yes' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-4"
          >
            <FormField
              control={control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your designation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter duration (e.g., 2 years)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="natureOfWork"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nature of Work <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the nature of your work"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold">Course Preference</h3>

        <FormField
          control={control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select PGDM Specialization <span className="text-red-500">*</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="IT Management">IT Management</SelectItem>
                  <SelectItem value="International Business">International Business</SelectItem>
                  <SelectItem value="Analytics">Analytics</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}


// Step 6: Declaration
const Step6Declaration = () => {
  const { control } = useFormContext()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Declaration</h2>
        <p className="text-gray-600">Please accept the declaration to complete your application</p>
      </div>

      <Card className="border-2">
        <CardContent className="pt-6">
          <FormField
            control={control}
            name="declaration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I hereby declare that the information provided is true and correct to the best of my knowledge. <span className="text-red-500">*</span>
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormMessage />
        </CardContent>
      </Card>
    </div>
  )
}

// Main Form Component
const AdmissionForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [completedSteps, setCompletedSteps] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      hasWorkExperience: undefined,
      declaration: false,
    },
  })

  // Update form values when step changes
  useEffect(() => {
    methods.clearErrors()
    // Merge all form data
    const allData = { ...formData, ...methods.getValues() }
    methods.reset(allData, { keepValues: true })
  }, [currentStep])

  const onNext = async () => {
    // Step 4 (Payment) has no validation, just display info
    if (currentStep === 4) {
      const stepData = methods.getValues()
      const updatedFormData = { ...formData, ...stepData }
      setFormData(updatedFormData)
      setCompletedSteps((prev) => [...new Set([...prev, currentStep])])
      setCurrentStep(currentStep + 1)
      return
    }

    const currentSchema = getCurrentStepSchema(currentStep)
    const stepData = methods.getValues()
    
    // Validate current step using Zod
    const result = currentSchema.safeParse(stepData)
    
    if (result.success) {
      const updatedFormData = { ...formData, ...stepData }
      setFormData(updatedFormData)
      setCompletedSteps((prev) => [...new Set([...prev, currentStep])])
      
      // Move to next step
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
    } else {
      // Set form errors from Zod validation
      const errors = result.error.flatten().fieldErrors
      Object.keys(errors).forEach((key) => {
        methods.setError(key, {
          type: 'manual',
          message: errors[key][0],
        })
      })
    }
  }

  const onPrevious = () => {
    const stepData = methods.getValues()
    setFormData((prev) => ({ ...prev, ...stepData }))
    const prevStep = currentStep - 1
    setCurrentStep(prevStep)
  }

  const onStepClick = (step) => {
    if (completedSteps.includes(step)) {
      const stepData = methods.getValues()
      setFormData((prev) => ({ ...prev, ...stepData }))
      setCurrentStep(step)
    }
  }

  const onSubmit = async () => {
    const currentSchema = getCurrentStepSchema(6)
    const stepData = methods.getValues()
    
    // Validate final step
    const result = currentSchema.safeParse(stepData)
    
    if (!result.success) {
      // Set form errors from Zod validation
      const errors = result.error.flatten().fieldErrors
      Object.keys(errors).forEach((key) => {
        methods.setError(key, {
          type: 'manual',
          message: errors[key][0],
        })
      })
      return
    }

    // Merge all form data
    const finalData = { ...formData, ...stepData }
    
    setIsSubmitting(true)
    
    try {
      // Create FormData instance
      const submitFormData = new FormData()
      
      // Append all text fields
      submitFormData.append('fullName', finalData.fullName || '')
      submitFormData.append('gender', finalData.gender || '')
      submitFormData.append('nationality', finalData.nationality || '')
      submitFormData.append('aadhaarNumber', finalData.aadhaarNumber || '')
      submitFormData.append('mobileNumber', finalData.mobileNumber || '')
      submitFormData.append('alternateMobileNumber', finalData.alternateMobileNumber || '')
      submitFormData.append('email', finalData.email || '')
      submitFormData.append('city', finalData.city || '')
      submitFormData.append('state', finalData.state || '')
      submitFormData.append('fathersName', finalData.fathersName || '')
      submitFormData.append('fathersMobileNumber', finalData.fathersMobileNumber || '')
      submitFormData.append('fathersOccupation', finalData.fathersOccupation || '')
      submitFormData.append('annualFamilyIncome', finalData.annualFamilyIncome || '')
      submitFormData.append('tenthBoard', finalData.tenthBoard || '')
      submitFormData.append('tenthPercentage', finalData.tenthPercentage || '')
      submitFormData.append('twelfthBoard', finalData.twelfthBoard || '')
      submitFormData.append('twelfthYear', finalData.twelfthYear || '')
      submitFormData.append('twelfthPercentage', finalData.twelfthPercentage || '')
      submitFormData.append('graduationDegree', finalData.graduationDegree || '')
      submitFormData.append('graduationYear', finalData.graduationYear || '')
      submitFormData.append('graduationPercentage', finalData.graduationPercentage || '')
      submitFormData.append('entranceExamName', finalData.entranceExamName || '')
      submitFormData.append('entranceExamScore', finalData.entranceExamScore || '')
      submitFormData.append('hasWorkExperience', finalData.hasWorkExperience || '')
      submitFormData.append('organizationName', finalData.organizationName || '')
      submitFormData.append('designation', finalData.designation || '')
      submitFormData.append('duration', finalData.duration || '')
      submitFormData.append('natureOfWork', finalData.natureOfWork || '')
      submitFormData.append('specialization', finalData.specialization || '')
      submitFormData.append('declaration', finalData.declaration ? 'true' : 'false')
      
      // Send POST request to API
      const response = await fetch('/api/submit-admission', {
        method: 'POST',
        body: submitFormData,
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        toast({
          title: 'Application Submitted Successfully!',
          description: `Application ID: ${result.applicationId}.`,
          variant: 'default',
          duration: 10000,
        })
        
        // Reset form
        setCurrentStep(1)
        setFormData({})
        setCompletedSteps([])
        methods.reset({
          hasWorkExperience: undefined,
          declaration: false,
        })
      } else {
        toast({
          title: 'Submission Failed',
          description: result.message || 'Failed to submit application. Please try again.',
          variant: 'destructive',
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast({
        title: 'Network Error',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Personal />
      case 2:
        return <Step2Contact />
      case 3:
        return <Step3Academic />
      case 4:
        return <Step4Payment />
      case 5:
        return <Step5WorkCourse />
      case 6:
        return <Step6Declaration />
      default:
        return <Step1Personal />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold uppercase text-gray-900 mb-2">
            PGDM Admission Application Form
          </h1>
          <p className="text-xl text-gray-600">Session 2026-28</p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-6 md:p-8">
            <Form {...methods}>
              <Stepper
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepClick={onStepClick}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                {currentStep < 6 ? (
                  <Button type="button" onClick={onNext}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                )}
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Export default page component
const page = () => {
  return <AdmissionForm />
}

export default page
