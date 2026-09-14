-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "client" TEXT,
    "year" INTEGER,
    "role" TEXT,
    "thumbnail" TEXT,
    "videoUrl" TEXT,
    "gallery" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "company" TEXT,
    "role" TEXT,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "projectType" TEXT,
    "budgetRange" TEXT,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'JOSEPH.',
    "heroHeading" TEXT NOT NULL DEFAULT 'FRAME YOUR STORY.',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Cinematographer - Videographer - Editor',
    "heroCtaLabel" TEXT NOT NULL DEFAULT 'View My Work',
    "heroCtaLink" TEXT NOT NULL DEFAULT '/work',
    "heroSecondaryCta" TEXT NOT NULL DEFAULT 'Contact Me',
    "heroSecondaryLink" TEXT NOT NULL DEFAULT '/contact',
    "homeFeaturedEyebrow" TEXT NOT NULL DEFAULT 'Featured Work',
    "homeFeaturedTitle" TEXT NOT NULL DEFAULT 'Selected Projects',
    "homeServicesEyebrow" TEXT NOT NULL DEFAULT 'What I Do',
    "homeServicesTitle" TEXT NOT NULL DEFAULT 'Services built for stories that need to be seen.',
    "homeAboutEyebrow" TEXT NOT NULL DEFAULT 'About',
    "homeCtaTitle" TEXT NOT NULL DEFAULT 'Got a project in mind?',
    "homeCtaSubtitle" TEXT NOT NULL DEFAULT 'Let us bring your vision to life.',
    "homeCtaButton" TEXT NOT NULL DEFAULT 'Start a Conversation',
    "workEyebrow" TEXT NOT NULL DEFAULT 'Portfolio',
    "workTitle" TEXT NOT NULL DEFAULT 'Selected Work',
    "servicesEyebrow" TEXT NOT NULL DEFAULT 'Services',
    "servicesTitle" TEXT NOT NULL DEFAULT 'What I Offer',
    "servicesSubtitle" TEXT NOT NULL DEFAULT 'End-to-end creative production from concept to final delivery.',
    "aboutEyebrow" TEXT NOT NULL DEFAULT 'About',
    "contactEyebrow" TEXT NOT NULL DEFAULT 'Contact',
    "contactTitle" TEXT NOT NULL DEFAULT 'Let us Talk',
    "contactSubtitle" TEXT NOT NULL DEFAULT 'Tell me about your project and I will get back to you.',
    "navLinks" TEXT NOT NULL DEFAULT '[{"label":"Home","href":"/"},{"label":"Work","href":"/work"},{"label":"About","href":"/about"},{"label":"Services","href":"/services"},{"label":"Contact","href":"/contact"}]',
    "navCtaLabel" TEXT NOT NULL DEFAULT 'Let us Talk',
    "formProjectTypes" TEXT NOT NULL DEFAULT '["Cinematography","Videography","Video Editing","Commercial","Social Media Content","Creative Direction","Other"]',
    "formBudgets" TEXT NOT NULL DEFAULT '["Under $500","$500 - $1,000","$1,000 - $5,000","$5,000 - $10,000","$10,000+","Not sure yet"]',
    "formSuccessTitle" TEXT NOT NULL DEFAULT 'Message sent',
    "formSuccessText" TEXT NOT NULL DEFAULT 'Thanks for reaching out. I will get back to you soon.',
    "aboutName" TEXT NOT NULL DEFAULT 'Joseph Chimaobi Egbuonu',
    "aboutHeadline" TEXT NOT NULL DEFAULT 'Creative Director & Cinematographer',
    "aboutBio" TEXT NOT NULL DEFAULT '',
    "aboutImage" TEXT,
    "aboutExperience" TEXT,
    "aboutSkills" TEXT,
    "aboutTools" TEXT,
    "aboutAvailability" TEXT NOT NULL DEFAULT 'Available for projects',
    "aboutLocation" TEXT NOT NULL DEFAULT 'Lagos, Nigeria',
    "aboutEmail" TEXT NOT NULL DEFAULT '',
    "aboutPhone" TEXT NOT NULL DEFAULT '',
    "contactEmail" TEXT NOT NULL DEFAULT '',
    "contactPhone" TEXT NOT NULL DEFAULT '',
    "whatsappNumber" TEXT NOT NULL DEFAULT '',
    "whatsappQr" TEXT,
    "seoTitle" TEXT NOT NULL DEFAULT 'Joseph Chimaobi Egbuonu - Creative Portfolio',
    "seoDescription" TEXT NOT NULL DEFAULT 'Cinematographer, Videographer & Creative Director',
    "seoOgImage" TEXT,
    "footerNavigateTitle" TEXT NOT NULL DEFAULT 'Navigate',
    "footerConnectTitle" TEXT NOT NULL DEFAULT 'Connect',
    "footerText" TEXT NOT NULL DEFAULT 'Copyright Joseph Chimaobi Egbuonu. All rights reserved.',
    "previewToken" TEXT,
    "previewEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThemeSettings" (
    "id" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'dark',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThemeSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSettings_previewToken_key" ON "SiteSettings"("previewToken");
