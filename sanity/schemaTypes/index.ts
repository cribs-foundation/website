import type { SchemaTypeDefinition } from "sanity";

// objects (reusable / embeddable)
import { seo } from "./objects/seo";
import { navItem } from "./objects/navItem";
import { socialLink } from "./objects/socialLink";
import { altImage } from "./objects/altImage";
import { bankAccount } from "./objects/bankAccount";
import { phoneNumber } from "./objects/phoneNumber";
import { officeHour } from "./objects/officeHour";
import { quote } from "./objects/quote";
import { ctaBlock } from "./objects/ctaBlock";
import { downloadableForm } from "./objects/downloadableForm";

// singleton documents
import { siteSettings } from "./documents/siteSettings";
import { homePage } from "./documents/homePage";
import { donationInfo } from "./documents/donationInfo";
import { contactInfo } from "./documents/contactInfo";
import { obraPage } from "./documents/obraPage";

// collection documents
import { program } from "./documents/program";
import { historyMilestone } from "./documents/historyMilestone";
import { impactStat } from "./documents/impactStat";
import { partner } from "./documents/partner";
import { event } from "./documents/event";
import { obraCategory } from "./documents/obraCategory";
import { galleryAlbum } from "./documents/galleryAlbum";
import { accreditation } from "./documents/accreditation";

export const schemaTypes: SchemaTypeDefinition[] = [
  // objects
  seo,
  navItem,
  socialLink,
  altImage,
  bankAccount,
  phoneNumber,
  officeHour,
  quote,
  ctaBlock,
  downloadableForm,
  // singletons
  siteSettings,
  homePage,
  donationInfo,
  contactInfo,
  obraPage,
  // collections
  program,
  historyMilestone,
  impactStat,
  partner,
  event,
  obraCategory,
  galleryAlbum,
  accreditation,
];
