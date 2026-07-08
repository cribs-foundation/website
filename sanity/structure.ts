import type { StructureResolver } from "sanity/structure";
import {
  CogIcon,
  HomeIcon,
  CreditCardIcon,
  EnvelopeIcon,
  ImagesIcon,
  HeartIcon,
  CalendarIcon,
  TrendUpwardIcon,
  UsersIcon,
  ImageIcon,
  CheckmarkCircleIcon,
} from "@sanity/icons";

// document types managed as singletons — excluded from generic lists so they
// don't appear twice and can't be duplicated.
const SINGLETONS = [
  "siteSettings",
  "homePage",
  "donationInfo",
  "contactInfo",
  "obraPage",
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // 1. site-wide singletons
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.listItem()
        .title("Home Page")
        .icon(HomeIcon)
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Donation Info")
        .icon(CreditCardIcon)
        .child(
          S.document().schemaType("donationInfo").documentId("donationInfo"),
        ),
      S.listItem()
        .title("Contact Info")
        .icon(EnvelopeIcon)
        .child(
          S.document().schemaType("contactInfo").documentId("contactInfo"),
        ),
      S.listItem()
        .title("Obra Ni Ate Ko Page")
        .icon(ImagesIcon)
        .child(S.document().schemaType("obraPage").documentId("obraPage")),

      S.divider(),

      // 2. collections
      S.documentTypeListItem("program").title("Programs").icon(HeartIcon),
      S.documentTypeListItem("historyMilestone")
        .title("History Milestones")
        .icon(CalendarIcon),
      S.documentTypeListItem("impactStat")
        .title("Impact Stats")
        .icon(TrendUpwardIcon),
      S.documentTypeListItem("partner").title("Partners").icon(UsersIcon),
      S.documentTypeListItem("accreditation")
        .title("Accreditations")
        .icon(CheckmarkCircleIcon),

      S.divider(),

      S.documentTypeListItem("event").title("Events").icon(CalendarIcon),
      S.documentTypeListItem("obraCategory")
        .title("Obra Categories")
        .icon(ImageIcon),
      S.documentTypeListItem("galleryAlbum")
        .title("Gallery Albums")
        .icon(ImagesIcon),

      S.divider(),

      // 3. anything else, minus singletons (safety net for future types)
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return (
          id !== undefined &&
          ![
            ...SINGLETONS,
            "program",
            "historyMilestone",
            "impactStat",
            "partner",
            "accreditation",
            "event",
            "obraCategory",
            "galleryAlbum",
          ].includes(id)
        );
      }),
    ]);
