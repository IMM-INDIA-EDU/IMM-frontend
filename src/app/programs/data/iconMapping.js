import {
    Briefcase,
    FileSpreadsheet,
    Brain,
    Languages,
    TrendingUp,
    FileText,
    Network,
    Puzzle,
    Zap,
    Rocket,
    Users,
    GraduationCap,
    Award,
    User,
    ClipboardList,
    GitBranch,
    Layers,
    Lightbulb,
    Trophy,
    Handshake,
    Target,
    Star,
    Sparkles,
    Building2,
    TrendingDown,
    BarChart3,
    Megaphone,
    DollarSign,
    UserCog,
    Factory,
    Calculator,
    MessageSquare,
    Globe,
    Hash,
    BookOpen,
    Gavel,
    Palette,
    BriefcaseBusiness,
    FolderKanban,
  } from "lucide-react";
  
  // Mapping of module/title names to Lucide React icons
  export const iconMap = {
    // Titles - Skill Certifications
    "Launchpad to Leadership": Rocket,
    "Catalysts for Collaboration": Users,
    "Pathways to Mastery": GraduationCap,
    "Pinnacle to Professionalism": Award,
    
    // Titles - Course Curriculum
    "Building the Foundation For Success": Building2,
    "Expanding Horizons through Specializations": Target,
    "Mastering Application and Leadership": Trophy,
    "Culmination and Real - World Impact": Star,
    
    // Modules
    "Acing Corporate Skills 1.0": Briefcase,
    "Acing Corporate Skills 2.0": Briefcase,
    "Acing Corporate Skills 3.0": Briefcase,
    "Acing Corporate Skills 4.0": Briefcase,
    "Excel": FileSpreadsheet,
    "Advance Excel": TrendingUp,
    "AI & ML": Brain,
    "French Language 1.0": Languages,
    "French Language 2.0": Languages,
    "Research Project Writing (SPSS)": ClipboardList,
    "Transactional Analysis": Network,
    "Gestalt Theory": Puzzle,
    "Nudge Theory": Zap,
    
    // Course Curriculum Modules
    "Principles of Management": Briefcase,
    "Economics For Managers": TrendingDown,
    "Business Statistics": BarChart3,
    "Marketing Management": Megaphone,
    "Financial Management": DollarSign,
    "Human Resource Management": UserCog,
    "Production & Operations Management": Factory,
    "Introduction to Business Analytics": Brain,
    "Management Accounting": Calculator,
    "Managerial Communication": MessageSquare,
    "Digital Marketing 1.0": Globe,
    "Digital Marketing 2.0": Globe,
    "Quantitative Techniques": Hash,
    "Managing Business Research": BookOpen,
    "Strategic Management": Target,
    "Organizational Behaviour": Users,
    "Legal Aspects of Business": Gavel,
    "Design Thinking & its Application": Palette,
    "Summer Internship Project": BriefcaseBusiness,
    "Project Management": FolderKanban,
    "Industry Oriented Project": BriefcaseBusiness,
    
    // Specializations
    "Marketing & Innovation Management": Megaphone,
    "Financial Management": DollarSign,
    "Human Resource Management": UserCog,
    "Operations & Supply Chain Management": Factory,
    "Business Analytics & Research": Brain,
    "International Business Management": Globe,
    "Entrepreneurship Management": Rocket,
    
    // Default
    "User": User,
  };
  
  // Helper function to get icon component
  export const getIcon = (name) => {
    return iconMap[name] || Briefcase; // Default to Briefcase if not found
  };
  