import React, { lazy } from "react";
import RouteGuard from "./RouteGuard";

const Dashboard = lazy(() => import("../components/dashboard/dashboard"));
const Ledger = lazy(() => import("../components/ledger/Ledger"));
const Analytics = lazy(() => import("../components/analytics/Analytics"));
const Category = lazy(() => import("../components/catalogue/category/Category"));
const CustomField = lazy(() => import("../components/catalogue/customfield/CustomField"));
const Inventory = lazy(() => import("../components/stocks/inventory/Inventory"));
const AddNewCategory = lazy(() => import("../components/catalogue/category/AddNewCategory"));
const ViewCategory = lazy(() => import("../components/catalogue/category/ViewCategory"));
const EditCategory = lazy(() => import("../components/catalogue/category/EditCategory"));
const ViewWithVarient = lazy(() => import("../components/inventory-with-variant/ViewWithVarient"));
const AddInventoryWithVariant = lazy(() => import("../components/inventory-with-variant/AddInventoryWithVariant"));
const ViewImage = lazy(() => import("../components/catalogue/category/ViewImage"));
const CustumFieldValue = lazy(() => import("../components/catalogue/customfield/CustumFieldValue"));
const Brand = lazy(() => import("../components/brand/Brand"));
const AddBrand = lazy(() => import("../components/brand/AddBrand"));
const EditBrand = lazy(() => import("../components/brand/EditBrand"));
const ViewBrand = lazy(() => import("../components/brand/ViewBrand"));
const UserProfile = lazy(() => import("../components/user-profile/UserProfile"));
const EditInventoryWithVariant = lazy(() => import("../components/inventory-with-variant/EditInventoryWithVariant"));
const Frame = lazy(() => import("../components/frames/Frames"));
const AddNewFrame = lazy(() => import("../components/frames/AddNewFrame"));
const EditFrame = lazy(() => import("../components/frames/EditFrame"));
const ViewFrame = lazy(() => import("../components/frames/ViewFrame"));
const Lens = lazy(() => import("../components/lens/Lens"));
const AddLens = lazy(() => import("../components/lens/AddLens"));
const ViewLens = lazy(() => import("../components/lens/ViewLens"));
const EditLens = lazy(() => import("../components/lens/EditLens"));
const Filter = lazy(() => import("../components/filter/Filter"));
const AddFilter = lazy(() => import("../components/filter/AddFilter"));
const EditFilter = lazy(() => import("../components/filter/EditFilter"));
const ViewFilter = lazy(() => import("../components/filter/ViewFilter"));
const LensThickness = lazy(() => import("../components/lens-thickness/LensThickness"));
const AddLensThickness = lazy(() => import("../components/lens-thickness/AddLensThickness"));
const EditLensThickness = lazy(() => import("../components/lens-thickness/EditLensThickness"));
const ViewLensThickness = lazy(() => import("../components/lens-thickness/ViewLensThickness"));
const InventorySizes = lazy(() => import("../components/inventory-with-variant/InventorySizes"));
const LensColor = lazy(() => import("../components/lens-color/LensColor"));
const AddLensColor = lazy(() => import("../components/lens-color/AddLensColor"));
const EditLensColor = lazy(() => import("../components/lens-color/EditLensColor"));
const ViewLensColor = lazy(() => import("../components/lens-color/ViewLensColor"));
const ContactLensType = lazy(() => import("../components/contact-lens-type/ContactLensType"));
const AddContactLensType = lazy(() => import("../components/contact-lens-type/AddContactLensType"));
const EditContactLensType = lazy(() => import("../components/contact-lens-type/EditContactLensType"));
const ViewContactLensType = lazy(() => import("../components/contact-lens-type/ViewContactLensType"));
const Material = lazy(() => import("../components/material/Material"));
const AddMaterial = lazy(() => import("../components/material/AddMaterial"));
const EditMaterial = lazy(() => import("../components/material/EditMaterial"));
const ViewMaterial = lazy(() => import("../components/material/ViewMaterial"));
const Questions = lazy(() => import("../components/questions/Questions"));
const AddQuestion = lazy(() => import("../components/questions/AddQuestions"));
const EditQuestion = lazy(() => import("../components/questions/EditQuestion"));
const ViewQuestion = lazy(() => import("../components/questions/ViewQuestion"));
const DeleteQuestion = lazy(() => import("../components/questions/DeleteQuestion"));
const Carrier = lazy(() => import("../components/shipping/carrier/Carrier"));
const ShippingZone = lazy(() => import("../components/shipping/shipping-zone/ShippingZone"));
const AddNewCarrier = lazy(() => import("../components/shipping/carrier/AddNewCarrier"));
const ViewCarrier = lazy(() => import("../components/shipping/carrier/ViewCarrier"));
const EditCarrier = lazy(() => import("../components/shipping/carrier/EditCarrier"));
const FaqsDetails = lazy(() => import("../components/faq/FaqsDetails"));
const AddFaqs = lazy(() => import("../components/faq/AddFaqs"));
const EditFaqs = lazy(() => import("../components/faq/EditFaqs"));
const ViewFaqs = lazy(() => import("../components/faq/ViewFaqs"));
const Country = lazy(() => import("../components/country/Country"));
const Currency = lazy(() => import("../components/currency/Currecy"));
const AddCurrency = lazy(() => import("../components/currency/AddCurrency"));
const EditCurrency = lazy(() => import("../components/currency/EditCurrency"));
const ViewCurrency = lazy(() => import("../components/currency/ViewCurrency"));
const CurrencyExchangeRate = lazy(() => import("../components/exchanage-rate/CurrecyExchangeRate"));
const AddCurrencyExchangeRate = lazy(() => import("../components/exchanage-rate/AddCurrencyExchangeRate"));
const ViewCurrencyExchangeRate = lazy(() => import("../components/exchanage-rate/ViewCurrencyExchangeRate"));
const EditCurrencyExchangeRate = lazy(() => import("../components/exchanage-rate/EditCurrencyExchangeRate"));
const Cart = lazy(() => import("../components/cart/Cart"));
const Home = lazy(() => import("../components/cms/home-page/Home"));
const Coupon = lazy(() => import("../components/coupon/Coupon"));
const AddCoupon = lazy(() => import("../components/coupon/AddCoupon"));
const EditCoupon = lazy(() => import("../components/coupon/EditCoupon"));
const ViewCoupon = lazy(() => import("../components/coupon/ViewCoupon"));
const JobPosition = lazy(() => import("../components/job-position/JobPosition"));
const AddJobPosition = lazy(() => import("../components/job-position/AddJobPosition"));
const EditJobPosition = lazy(() => import("../components/job-position/EditJobPosition"));
const ViewJobPosition = lazy(() => import("../components/job-position/ViewJobPosition"));
const Career = lazy(() => import("../components/career/Career"));
const AboutUs = lazy(() => import("../components/cms/about-us/AboutUs"));
const Orders = lazy(() => import("../components/orders/Orders"));
const OrdersDetails = lazy(() => import("../components/orders/OrderDetails"));
const HtoOrders = lazy(() => import("../components/orders/HtoOrders"));
const HtoOrderDetails = lazy(() => import("../components/orders/HtoOrderDetails"));
const GlobalSetting = lazy(() => import("../components/global-setting/GlobalSetting"));
const WithdrawalRequest = lazy(() => import("../components/affiliate/withdrawal/WithdrawalRequest"));
const CouponRequest = lazy(() => import("../components/affiliate/coupon/CouponRequest"));
const AddNewContactLens = lazy(() => import("../components/contact-lens/AddNewContactLens"));
const AllContactLens = lazy(() => import("../components/contact-lens/AllContactLens"));
const EditContactLens = lazy(() => import("../components/contact-lens/EditContactLens"));
const ViewContactLens = lazy(() => import("../components/contact-lens/ViewContactLens"));
const ContactUsPage = lazy(() => import("../components/cms/contact-us/ContactUsPage"));
const AllAccessories = lazy(() => import("../components/accessories/AllAccessories"));
const AddAccessories = lazy(() => import("../components/accessories/AddAccessories"));
const EditAccessories = lazy(() => import("../components/accessories/EditAccessories"));
const ViewAccessories = lazy(() => import("../components/accessories/ViewAccessories"));
const AffiliatePage = lazy(() => import("../components/cms/affiliate-page/AffiliatePage"));
const HomeTryOn = lazy(() => import("../components/cms/hometryon/HomeTryOn"));
const OptometristNetwork = lazy(() => import("../components/optometrist/optometrist-network/OptometristNetwork"));
const AllOptometristStore = lazy(() => import("../components/optometrist/AllOptometristStore"));
const AddOptometristStore = lazy(() => import("../components/optometrist/AddOptometristStore"));
const ViewOptometristStore = lazy(() => import("../components/optometrist/ViewOptometristStore"));
const EditOptometristStore = lazy(() => import("../components/optometrist/EditOptometristStore"));
const InventoryWithoutVariant = lazy(() => import("../components/stocks/inventory-without-variant/InventoryWithoutVariant"));
const AddInventoryWithoutVariant = lazy(() => import("../components/stocks/inventory-without-variant/AddInventoryWithoutVariant"));
const EditInventoryWithoutVariant = lazy(() => import("../components/stocks/inventory-without-variant/EditInventoryWithoutVariant"));
const ViewInventoryWithoutVariant = lazy(() => import("../components/stocks/inventory-without-variant/ViewInventoryWithoutVariant"));
const LocalizationFA = lazy(() => import("../components/localization/fa/LocalizationFA"));
const LocalizationAR = lazy(() => import("../components/localization/ar/LocalizationAR"));
const LocalizationEN = lazy(() => import("../components/localization/en/LocalizationEN"));
const AllPosts = lazy(() => import("../components/blogs/AllPosts"));
const AddNewPost = lazy(() => import("../components/blogs/AddNewPost"));
const EditPost = lazy(() => import("../components/blogs/EditPost"));
const ViewPost = lazy(() => import("../components/blogs/ViewPost"));
const BlogCategories = lazy(() => import("../components/blogs/categories/BlogCategories"));
const AddNewBlogCategory = lazy(() => import("../components/blogs/categories/AddNewBlogCategory"));
const EditBlogCategory = lazy(() => import("../components/blogs/categories/EditBlogCategory"));
const ViewBlogCategory = lazy(() => import("../components/blogs/categories/ViewBlogCategory"));
const BlogTags = lazy(() => import("../components/blogs/tags/BlogTags"));
const Comments = lazy(() => import("../components/blogs/comments/Comments"));
const Customer = lazy(() => import("../components/customer-data/customer/Customer"));
const ContactEnquiries = lazy(() => import("../components/customer-data/contact-enquiries/ContactEnquiries"));
const JobApplicationEnquiry = lazy(() => import("../components/customer-data/job-application-enquiries/JobApplicationEnquiry"));
const Wishlist = lazy(() => import("../components/wishlist/Wishlist"));
const AllStudentsList = lazy(() => import("../components/customer-data/students/AllStudentsList"));
const PolicyPage = lazy(() => import("../components/cms/policy-pages/PolicyPage"));
const AddPolicy = lazy(() => import("../components/cms/policy-pages/AddPolicy"));
const EditPolicy = lazy(() => import("../components/cms/policy-pages/EditPolicy"));
const ViewPolicy = lazy(() => import("../components/cms/policy-pages/ViewPolicy"));
const Dispute = lazy(() => import("../components/dispute/Dispute"));
const ViewDisputeDetails = lazy(() => import("../components/dispute/viewDisputeDetails"));
const AddNewReview = lazy(() => import("../components/reviews/AddNewReview"));
const EditReview = lazy(() => import("../components/reviews/EditReview"));
const ViewReview = lazy(() => import("../components/reviews/ViewReview"));
const AllReviews = lazy(() => import("../components/reviews/AllReviews"));
const ReviewByProduct = lazy(() => import("../components/reviews/ReviewByProduct"));
const Media = lazy(() => import("../components/media/Media"));
const StaffPermission = lazy(() => import("../components/staff-permissions/StaffPermission"));
const StaffUsers = lazy(() => import("../components/staff-permissions/StaffUsers"));
const StaffLogin = lazy(() => import("../components/staff-login/StaffLogin"));
const Notification = lazy(() => import("../components/support desk/notification/Notification"));
const AddNewNotification = lazy(() => import("../components/support desk/notification/AddNewNotification"));
const EditNotification = lazy(() => import("../components/support desk/notification/EditNotification"));
const PushNotification = lazy(() => import("../components/support desk/push-notification/PushNotification"));
const AddNewPushNotification = lazy(() => import("../components/support desk/push-notification/AddNewPushNotification"));
const EditPushNotification = lazy(() => import("../components/support desk/push-notification/EditPushNotification"));
const BecomeAnOptometrist = lazy(() => import("../components/optometrist/optometrist-enquiry/BecomeAnOptometrist"));
const AllOptometristEnquiries = lazy(() => import("../components/optometrist/optometrist-enquiry/AllOptometristEnquiries"));
const OptometristWithdrawalRequests = lazy(() => import("../components/optometrist/withdrawal/WithdrawalRequests"));
const ViewOptometristEnquiry = lazy(() => import("../components/optometrist/optometrist-enquiry/ViewOptometristEnquiry"));
const AllOptometristMembershipsPlans = lazy(() => import("../components/optometrist/membership/AllOptometristMembershipsPlans"));
const PlaceholderPage = lazy(() => import("../components/optometrist-dashboard/PlaceholderPage"));
const Services = lazy(() => import("../components/optometrist-dashboard/services/Services"));
const WorkingRule = lazy(() => import("../components/optometrist-dashboard/working-rule/WorkingRule"));
const Availability = lazy(() => import("../components/optometrist-dashboard/availability/Availability"));
const Appointments = lazy(() => import("../components/optometrist-dashboard/appointments/Appointments"));
const Customers = lazy(() => import("../components/optometrist-dashboard/customers/Customers"));
const Membership = lazy(() => import("../components/optometrist-dashboard/membership/Membership"));
const PlanHistory = lazy(() => import("../components/optometrist-dashboard/plan-history/PlanHistory"));
const Transactions = lazy(() => import("../components/optometrist-dashboard/transactions/Transactions"));
const Wallet = lazy(() => import("../components/optometrist-dashboard/wallet/Wallet"));
const Overview = lazy(() => import("../components/optometrist-dashboard/overview/Overview"));
const Profile = lazy(() => import("../components/optometrist-dashboard/profile/Profile"));

export const RouterData = [
  // Dashboard (accessible to all authenticated users, SuperAdmin without country allowed)
  {
    path: `${import.meta.env.BASE_URL}/dashboard`,
    element: <RouteGuard requiredPermissions={[{ category: "Dashboard", action: "view" }]}><Dashboard /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/ledger`,
    element: <RouteGuard requiredPermissions={[{ category: "Dashboard", action: "view" }]}><Ledger /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/analytics`,
    element: <RouteGuard requiredPermissions={[{ category: "Analytics", action: "view" }]}><Analytics /></RouteGuard>,
  },
  // Profile
  {
    path: `${import.meta.env.BASE_URL}/profile`,
    element: <RouteGuard requiredPermissions={[{ category: "Profile", action: "view" }]}><UserProfile /></RouteGuard>,
  },
  // Country (accessible to SuperAdmin without country, no permissions required)
  {
    path: `${import.meta.env.BASE_URL}/country-list`,
    element: <Country />,
  },
  // Category
  {
    path: `${import.meta.env.BASE_URL}/catalogue/category`,
    element: <RouteGuard requiredPermissions={[{ category: "Category", action: "view" }]}><Category /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/add-new-category`,
    element: <RouteGuard requiredPermissions={[{ category: "Category", action: "add" }]}><AddNewCategory /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/category/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Category", action: "view" }]}><ViewCategory /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/edit-category/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Category", action: "edit" }]}><EditCategory /></RouteGuard>,
  },
  // Brand
  {
    path: `${import.meta.env.BASE_URL}/brand`,
    element: <RouteGuard requiredPermissions={[{ category: "Brand", action: "view" }]}><Brand /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/add-brand`,
    element: <RouteGuard requiredPermissions={[{ category: "Brand", action: "add" }]}><AddBrand /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/edit-brand/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Brand", action: "edit" }]}><EditBrand /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/view-brand/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Brand", action: "view" }]}><ViewBrand /></RouteGuard>,
  },
  // Frame
  {
    path: `${import.meta.env.BASE_URL}/catalogue/frames`,
    element: <RouteGuard requiredPermissions={[{ category: "Frame", action: "view" }]}><Frame /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/frames/add`,
    element: <RouteGuard requiredPermissions={[{ category: "Frame", action: "add" }]}><AddNewFrame /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/frames/edit/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Frame", action: "edit" }]}><EditFrame /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/frames/view/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Frame", action: "view" }]}><ViewFrame /></RouteGuard>,
  },
  // contact lens
  {
    path: `${import.meta.env.BASE_URL}/catalogue/contact-lenses`,
    element: <RouteGuard requiredPermissions={[{ category: "ContactLens", action: "view" }]}><AllContactLens /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/contact-lenses/add`,
    element: <RouteGuard requiredPermissions={[{ category: "ContactLens", action: "add" }]}><AddNewContactLens /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/contact-lenses/edit/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "ContactLens", action: "edit" }]}><EditContactLens /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/contact-lenses/view/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "ContactLens", action: "view" }]}><ViewContactLens /></RouteGuard>,
  },

  // Accessories 
  {
    path: `${import.meta.env.BASE_URL}/catalogue/accessories`,
    element: <RouteGuard requiredPermissions={[{ category: "Accessories", action: "view" }]}><AllAccessories /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/accessories/add`,
    element: <RouteGuard requiredPermissions={[{ category: "Accessories", action: "add" }]}><AddAccessories /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/accessories/edit/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Accessories", action: "edit" }]}><EditAccessories /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/accessories/view/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Accessories", action: "view" }]}><ViewAccessories /></RouteGuard>,
  },

  // Lens
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lenses`,
    element: <RouteGuard requiredPermissions={[{ category: "Lens", action: "view" }]}><Lens /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens/add`,
    element: <RouteGuard requiredPermissions={[{ category: "Lens", action: "add" }]}><AddLens /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens/edit/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Lens", action: "edit" }]}><EditLens /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens/view/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Lens", action: "view" }]}><ViewLens /></RouteGuard>,
  },
  // Lens Type
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens-type`,
    element: <RouteGuard requiredPermissions={[{ category: "LensType", action: "view" }]}><Filter /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens-type/add`,
    element: <RouteGuard requiredPermissions={[{ category: "LensType", action: "add" }]}><AddFilter /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens-type/edit/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "LensType", action: "edit" }]}><EditFilter /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens-type/view/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "LensType", action: "view" }]}><ViewFilter /></RouteGuard>,
  },
  // Lens Thickness
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens-thickness`,
    element: <RouteGuard requiredPermissions={[{ category: "LensSize", action: "view" }]}><LensThickness /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens-thickness/add`,
    element: <RouteGuard requiredPermissions={[{ category: "LensSize", action: "add" }]}><AddLensThickness /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens-thickness/edit/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "LensSize", action: "edit" }]}><EditLensThickness /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens-thickness/view/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "LensSize", action: "view" }]}><ViewLensThickness /></RouteGuard>,
  },
  // Lens Color
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens-color`,
    element: <RouteGuard requiredPermissions={[{ category: "LensColor", action: "view" }]}><LensColor /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens-color/add`,
    element: <RouteGuard requiredPermissions={[{ category: "LensColor", action: "add" }]}><AddLensColor /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens-color/edit/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "LensColor", action: "edit" }]}><EditLensColor /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/lens-color/view/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "LensColor", action: "view" }]}><ViewLensColor /></RouteGuard>,
  },
  // Contact Lens Type
  {
    path: `${import.meta.env.BASE_URL}/catalogue/contact-lens-type`,
    element: <RouteGuard requiredPermissions={[{ category: "ContactLensType", action: "view" }]}><ContactLensType /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/contact-lens-type/add`,
    element: <RouteGuard requiredPermissions={[{ category: "ContactLensType", action: "add" }]}><AddContactLensType /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/contact-lens-type/edit/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "ContactLensType", action: "edit" }]}><EditContactLensType /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/contact-lens-type/view/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "ContactLensType", action: "view" }]}><ViewContactLensType /></RouteGuard>,
  },
  // Material
  {
    path: `${import.meta.env.BASE_URL}/catalogue/material`,
    element: <RouteGuard requiredPermissions={[{ category: "Material", action: "view" }]}><Material /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/material/add`,
    element: <RouteGuard requiredPermissions={[{ category: "Material", action: "add" }]}><AddMaterial /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/material/edit/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Material", action: "edit" }]}><EditMaterial /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/material/view/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Material", action: "view" }]}><ViewMaterial /></RouteGuard>,
  },
  // Questions
  {
    path: `${import.meta.env.BASE_URL}/questions`,
    element: <RouteGuard requiredPermissions={[{ category: "Question", action: "view" }]}><Questions /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/question/add`,
    element: <RouteGuard requiredPermissions={[{ category: "Question", action: "add" }]}><AddQuestion /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/question/edit/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Question", action: "edit" }]}><EditQuestion /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/question/view/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Question", action: "view" }]}><ViewQuestion /></RouteGuard>,
  },
  // Custom Field
  {
    path: `${import.meta.env.BASE_URL}/catalogue/custom-field`,
    element: <RouteGuard requiredPermissions={[{ category: "CustomField", action: "view" }]}><CustomField /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/catalogue/custom-field-value/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "CustomFieldValue", action: "view" }]}><CustumFieldValue /></RouteGuard>,
  },
  // Inventory
  {
    path: `${import.meta.env.BASE_URL}/stocks/inventory`,
    element: <RouteGuard requiredPermissions={[{ category: "InventoryWithoutVariant", action: "view" }]}><Inventory /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/stocks/inventory-variant-sizes/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "InventoryWithoutVariant", action: "edit" }]}><InventorySizes /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/inventor/view-invertory-with-varient/:type/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "InventoryWithVariant", action: "view" }]}><ViewWithVarient /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/inventor/edit-invertory-with-varient/:type/:modelId`,
    element: <RouteGuard requiredPermissions={[{ category: "InventoryWithVariant", action: "edit" }]}><EditInventoryWithVariant /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/inventor/add-invertory-with-varient`,
    element: <RouteGuard requiredPermissions={[{ category: "InventoryWithVariant", action: "add" }]}><AddInventoryWithVariant /></RouteGuard>,
  },

  // inventory without variant
  {
    path: `${import.meta.env.BASE_URL}/stocks/inventory-without-variant`,
    element: <RouteGuard requiredPermissions={[{ category: "InventoryWithoutVariant", action: "view" }]}><InventoryWithoutVariant /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/inventory/add-invertory-without-variant`,
    element: <RouteGuard requiredPermissions={[{ category: "InventoryWithVariant", action: "add" }]}><AddInventoryWithoutVariant /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/inventory/edit-invertory-without-variant/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "InventoryWithVariant", action: "edit" }]}><EditInventoryWithoutVariant /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/inventory/view-invertory-without-variant/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "InventoryWithVariant", action: "view" }]}><ViewInventoryWithoutVariant /></RouteGuard>,
  },
  // View Image
  {
    path: `${import.meta.env.BASE_URL}/view-images`,
    element: <RouteGuard requiredPermissions={[{ category: "Media", action: "view" }]}><ViewImage /></RouteGuard>,
  },
  // Shipping
  {
    path: `${import.meta.env.BASE_URL}/shipping/carrier`,
    element: <RouteGuard requiredPermissions={[{ category: "Carrier", action: "view" }]}><Carrier /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/shipping/shipping-zone`,
    element: <RouteGuard requiredPermissions={[{ category: "ShippingZone", action: "view" }]}><ShippingZone /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/shipping/carrier/add-new-carrier`,
    element: <RouteGuard requiredPermissions={[{ category: "Carrier", action: "add" }]}><AddNewCarrier /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/shipping/carrier/view-carrier/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Carrier", action: "view" }]}><ViewCarrier /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/shipping/carrier/edit-carrier/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Carrier", action: "edit" }]}><EditCarrier /></RouteGuard>,
  },
  // FAQs
  {
    path: `${import.meta.env.BASE_URL}/cms/faqs`,
    element: <RouteGuard requiredPermissions={[{ category: "Faqs", action: "view" }]}><FaqsDetails /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/cms/faqs/add`,
    element: <RouteGuard requiredPermissions={[{ category: "Faqs", action: "add" }]}><AddFaqs /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/cms/faqs/edit/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Faqs", action: "edit" }]}><EditFaqs /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/cms/faqs/view/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Faqs", action: "view" }]}><ViewFaqs /></RouteGuard>,
  },
  // Currency
  {
    path: `${import.meta.env.BASE_URL}/currency-list`,
    element: <RouteGuard requiredPermissions={[{ category: "Currency", action: "view" }]}><Currency /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/add-currency`,
    element: <RouteGuard requiredPermissions={[{ category: "Currency", action: "add" }]}><AddCurrency /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/edit-currency/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Currency", action: "edit" }]}><EditCurrency /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/view-currency/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Currency", action: "view" }]}><ViewCurrency /></RouteGuard>,
  },
  // Currency Exchange Rate
  {
    path: `${import.meta.env.BASE_URL}/currency-exchange-rate-list`,
    element: <RouteGuard requiredPermissions={[{ category: "CurrencyExchangeRate", action: "view" }]}><CurrencyExchangeRate /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/add-currency-exchange-rate`,
    element: <RouteGuard requiredPermissions={[{ category: "CurrencyExchangeRate", action: "add" }]}><AddCurrencyExchangeRate /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/edit-currency-exchange-rate/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "CurrencyExchangeRate", action: "edit" }]}><EditCurrencyExchangeRate /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/view-currency-exchange-rate/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "CurrencyExchangeRate", action: "view" }]}><ViewCurrencyExchangeRate /></RouteGuard>,
  },
  // Cart
  {
    path: `${import.meta.env.BASE_URL}/cart`,
    element: <RouteGuard requiredPermissions={[{ category: "Cart", action: "view" }]}><Cart /></RouteGuard>,
  },
  // Wishlist
  {
    path: `${import.meta.env.BASE_URL}/wishlist`,
    element: <RouteGuard requiredPermissions={[{ category: "Wishlist", action: "view" }]}><Wishlist /></RouteGuard>,
  },
  // CMS Home
  {
    path: `${import.meta.env.BASE_URL}/cms/home`,
    element: <RouteGuard requiredPermissions={[{ category: "HomePage", action: "view" }]}><Home /></RouteGuard>,
  },
  // Coupon
  {
    path: `${import.meta.env.BASE_URL}/coupons`,
    element: <RouteGuard requiredPermissions={[{ category: "Coupon", action: "view" }]}><Coupon /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/add-coupon`,
    element: <RouteGuard requiredPermissions={[{ category: "Coupon", action: "add" }]}><AddCoupon /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/edit-coupon/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Coupon", action: "edit" }]}><EditCoupon /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/view-coupon/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Coupon", action: "view" }]}><ViewCoupon /></RouteGuard>,
  },
  // Job Position
  {
    path: `${import.meta.env.BASE_URL}/cms/job-positions`,
    element: <RouteGuard requiredPermissions={[{ category: "JobOpening", action: "view" }]}><JobPosition /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/cms/add-job-positions`,
    element: <RouteGuard requiredPermissions={[{ category: "JobOpening", action: "add" }]}><AddJobPosition /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/cms/edit-job-positions/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "JobOpening", action: "edit" }]}><EditJobPosition /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/cms/view-job-positions/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "JobOpening", action: "view" }]}><ViewJobPosition /></RouteGuard>,
  },
  // Career Page
  {
    path: `${import.meta.env.BASE_URL}/cms/career-page`,
    element: <RouteGuard requiredPermissions={[{ category: "CareerPage", action: "view" }]}><Career /></RouteGuard>,
  },
  // About Us Page
  {
    path: `${import.meta.env.BASE_URL}/cms/about-us-page`,
    element: <RouteGuard requiredPermissions={[{ category: "AboutUs", action: "view" }]}><AboutUs /></RouteGuard>,
  },
  // Contact us
  {
    path: `${import.meta.env.BASE_URL}/cms/contact-us`,
    element: <RouteGuard requiredPermissions={[{ category: "contactUs", action: "view" }]}><ContactUsPage /></RouteGuard>,
  },
  // Affiliate Page
  {
    path: `${import.meta.env.BASE_URL}/cms/affiliate-page`,
    element: <RouteGuard requiredPermissions={[{ category: "AffiliatePage", action: "view" }]}><AffiliatePage /></RouteGuard>,
  },
  // Home try on Page
  {
    path: `${import.meta.env.BASE_URL}/cms/home-try-on-page`,
    element: <RouteGuard requiredPermissions={[{ category: "HomeTryOn", action: "view" }]}><HomeTryOn /></RouteGuard>,
  },



  // Orders
  {
    path: `${import.meta.env.BASE_URL}/orders`,
    element: <RouteGuard requiredPermissions={[{ category: "Order", action: "view" }]}><Orders /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/order-detail/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Order", action: "view" }]}><OrdersDetails /></RouteGuard>,
  },

  // HTO Orders
  {
    path: `${import.meta.env.BASE_URL}/hto-orders`,
    element: <RouteGuard requiredPermissions={[{ category: "HtoOrder", action: "view" }]}><HtoOrders /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/hto-order-detail/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "HtoOrder", action: "view" }]}><HtoOrderDetails /></RouteGuard>,
  },

  //global setting
  {
    path: `${import.meta.env.BASE_URL}/setting/global-setting`,
    element: <RouteGuard requiredPermissions={[{ category: "Global", action: "view" }]}><GlobalSetting /></RouteGuard>,
  },




  // affiliate
  {
    path: `${import.meta.env.BASE_URL}/affiliate/withdrawal-request`,
    element: <RouteGuard requiredPermissions={[{ category: "WithDrawl", action: "view" }]}><WithdrawalRequest /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/affiliate/coupon-request`,
    element: <RouteGuard requiredPermissions={[{ category: "AffiliateCoupon", action: "view" }]}><CouponRequest /></RouteGuard>,
  },





  // optometrist 
  {
    path: `${import.meta.env.BASE_URL}/optometrist/enquiry`,
    element: <RouteGuard requiredPermissions={[{ category: "optometrist", action: "view" }]}><AllOptometristEnquiries /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist/withdrawal-request`,
    element: <RouteGuard requiredPermissions={[{ category: "OptometristWithdrawal", action: "view" }]}><OptometristWithdrawalRequests /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist/enquiry/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "optometrist", action: "view" }]}><ViewOptometristEnquiry /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist/memberships-plans`,
    element: <RouteGuard requiredPermissions={[{ category: "OptometristMembership", action: "view" }]}><AllOptometristMembershipsPlans /></RouteGuard>,
  },
  // {
  //   path: `${import.meta.env.BASE_URL}/optometrist/all-stores`,
  //   element: <RouteGuard requiredPermissions={[{ category: "optometrist", action: "view" }]}><AllOptometristStore /></RouteGuard>,
  // },
  {
    path: `${import.meta.env.BASE_URL}/optometrist/all-stores`,
    element: <RouteGuard requiredPermissions={[{ category: "optometrist", action: "view" }]}><AllOptometristStore /></RouteGuard>,
  },
  // {
  //   path: `${import.meta.env.BASE_URL}/optometrist/appointment-list`,
  //   element: <RouteGuard requiredPermissions={[{ category: "optometrist", action: "view" }]}><AppointmentList /></RouteGuard>,
  // },
  {
    path: `${import.meta.env.BASE_URL}/optometrist-dashboard/overview`,
    element: <RouteGuard><Overview /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist-dashboard/profile`,
    element: <RouteGuard><Profile /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist-dashboard/services`,
    element: <RouteGuard><Services /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist-dashboard/working-rules`,
    element: <RouteGuard><WorkingRule /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist-dashboard/availability`,
    element: <RouteGuard><Availability /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist-dashboard/prescriptions`,
    element: <RouteGuard><Customers /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist-dashboard/appointments`,
    element: <RouteGuard><Appointments /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist-dashboard/customers`,
    element: <RouteGuard><Customers /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist-dashboard/memberships-plans`,
    element: <RouteGuard><Membership /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist-dashboard/plan-history`,
    element: <RouteGuard><PlanHistory /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist-dashboard/transactions`,
    element: <RouteGuard><Transactions /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist-dashboard/wallet`,
    element: <RouteGuard><Wallet /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist/store/add`,
    element: <RouteGuard requiredPermissions={[{ category: "Accessories", action: "add" }]}><AddOptometristStore /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist/store/edit/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Accessories", action: "edit" }]}><EditOptometristStore /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/optometrist/store/view/:id`,
    element: <RouteGuard requiredPermissions={[{ category: "Accessories", action: "view" }]}><ViewOptometristStore /></RouteGuard>,
  },

  {
    path: `${import.meta.env.BASE_URL}/optometrist/become-an-optometrist`,
    element: <RouteGuard requiredPermissions={[{ category: "BecomeOptometrist", action: "view" }]}><BecomeAnOptometrist /></RouteGuard>,
  },




  // optometrist network
  {
    path: `${import.meta.env.BASE_URL}/optometrist-network`,
    element: <RouteGuard requiredPermissions={[{ category: "OptometristNetwork", action: "view" }]}><OptometristNetwork /></RouteGuard>,
  },

  //  Localization
  {
    path: `${import.meta.env.BASE_URL}/localization/fa`,
    element: <RouteGuard requiredPermissions={[{ category: "localization", action: "view" }]}><LocalizationFA /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/localization/ar`,
    element: <RouteGuard requiredPermissions={[{ category: "LocalizationArabic", action: "view" }]}><LocalizationAR /></RouteGuard>,
  },
  {
    path: `${import.meta.env.BASE_URL}/localization/en`,
    element: <RouteGuard requiredPermissions={[{ category: "LocalizationEnglish", action: "view" }]}><LocalizationEN /></RouteGuard>,
  },


  // All Posts
  {
    path: `${import.meta.env.BASE_URL}/all-posts`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "BlogPost", action: "view" }]}>
        <AllPosts />
      </RouteGuard>
    ),
  },
  {
    path: `${import.meta.env.BASE_URL}/add-new-post`,
    element: (
      <RouteGuard matchAny requiredPermissions={[{ category: "BlogPost", action: "add" }, { category: "BlogPostAdd", action: "view" }]}>
        <AddNewPost />
      </RouteGuard>
    ),
  },
  {
    path: `${import.meta.env.BASE_URL}/all-posts/edit-post/:id`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "BlogPost", action: "edit" }]}>
        <EditPost />
      </RouteGuard>
    ),
  },
  {
    path: `${import.meta.env.BASE_URL}/all-posts/view-post/:id`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "BlogPost", action: "view" }]}>
        <ViewPost />
      </RouteGuard>
    ),
  },


  // Blog Categories
  {
    path: `${import.meta.env.BASE_URL}/all-blog-categories`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "BlogCategory", action: "view" }]}>
        <BlogCategories />
      </RouteGuard>
    ),
  },
  {
    path: `${import.meta.env.BASE_URL}/add-new-blog-category`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "BlogCategory", action: "add" }]}>
        <AddNewBlogCategory />
      </RouteGuard>
    ),
  },
  {
    path: `${import.meta.env.BASE_URL}/all-blog-category/edit-blog-category/:id`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "BlogCategory", action: "edit" }]}>
        <EditBlogCategory />
      </RouteGuard>
    ),
  },
  {
    path: `${import.meta.env.BASE_URL}/all-blog-category/view-blog-category/:id`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "BlogCategory", action: "view" }]}>
        <ViewBlogCategory />
      </RouteGuard>
    ),
  },


  // Blog Tags
  {
    path: `${import.meta.env.BASE_URL}/all-blog-tags`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "BlogTag", action: "view" }]}>
        <BlogTags />
      </RouteGuard>
    ),
  },


  // Comments
  {
    path: `${import.meta.env.BASE_URL}/all-comments`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "BlogComment", action: "view" }]}>
        <Comments />
      </RouteGuard>
    ),
  },


  // Customer Data → Customer
  {
    path: `${import.meta.env.BASE_URL}/customer-list`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "Customer", action: "view" }]}>
        <Customer />
      </RouteGuard>
    ),
  },

  // Students Enquiries
  {
    path: `${import.meta.env.BASE_URL}/all-students`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "Student", action: "view" }]}>
        <AllStudentsList />
      </RouteGuard>
    ),
  },

  // Contact Enquiries
  {
    path: `${import.meta.env.BASE_URL}/contact-enquiries`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "ContactEnquiry", action: "view" }]}>
        <ContactEnquiries />
      </RouteGuard>
    ),
  },

  // Job Application Enquiries
  {
    path: `${import.meta.env.BASE_URL}/job-application-enquiries`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "JobApplication", action: "view" }]}>
        <JobApplicationEnquiry />
      </RouteGuard>
    ),
  },


  // Policy Pages
  {
    path: `${import.meta.env.BASE_URL}/all-policies`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "Policy", action: "view" }]}>
        <PolicyPage />
      </RouteGuard>
    ),
  },
  {
    path: `${import.meta.env.BASE_URL}/add-policy`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "Policy", action: "add" }]}>
        <AddPolicy />
      </RouteGuard>
    ),
  },
  {
    path: `${import.meta.env.BASE_URL}/edit-policy/:id`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "Policy", action: "edit" }]}>
        <EditPolicy />
      </RouteGuard>
    ),
  },
  {
    path: `${import.meta.env.BASE_URL}/view-policy/:id`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "Policy", action: "view" }]}>
        <ViewPolicy />
      </RouteGuard>
    ),
  },


  // Disputes
  {
    path: `${import.meta.env.BASE_URL}/dispute`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "Dispute", action: "view" }]}>
        <Dispute />
      </RouteGuard>
    ),
  },
  {
    path: `${import.meta.env.BASE_URL}/dispute/view-disputes/:id`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "Dispute", action: "view" }]}>
        <ViewDisputeDetails />
      </RouteGuard>
    ),
  },


  // Reviews
  {
    path: `${import.meta.env.BASE_URL}/reviews`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "Review", action: "view" }]}>
        <AllReviews />
      </RouteGuard>
    ),
  },
  {
    path: `${import.meta.env.BASE_URL}/reviews/add-new/:type`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "Review", action: "add" }]}>
        <AddNewReview />
      </RouteGuard>
    ),
  },
  {
    path: `${import.meta.env.BASE_URL}/reviews/edit/:type/:id`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "Review", action: "edit" }]}>
        <EditReview />
      </RouteGuard>
    ),
  },
  {
    path: `${import.meta.env.BASE_URL}/reviews/view/:type/:id`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "Review", action: "view" }]}>
        <ViewReview />
      </RouteGuard>
    ),
  },
  {
    path: `${import.meta.env.BASE_URL}/reviews/:type/:id/:product_name`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "Review", action: "view" }]}>
        <ReviewByProduct />
      </RouteGuard>
    ),
  },



  // media 
  {
    path: `${import.meta.env.BASE_URL}/media-list`,
    element: (
      <RouteGuard requiredPermissions={[{ category: "Review", action: "view" }]}>
        <Media />
      </RouteGuard>
    ),
  },






  // Support Desk
  { path: `${import.meta.env.BASE_URL}/support-desk/notification`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Notification", action: "View" }]}><Notification /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/support-desk/notification/add-notification`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Notification", action: "add" }]}><AddNewNotification /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/support-desk/notification/edit-notification/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Notification", action: "edit" }]}><EditNotification /></RouteGuard>) },

  { path: `${import.meta.env.BASE_URL}/push-notification`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "PushNotification", action: "view" }]}><PushNotification /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/push-notification/add-push-notification`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "PushNotification", action: "add" }]}><AddNewPushNotification /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/push-notification/edit-push-notification/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "PushNotification", action: "edit" }]}><EditPushNotification /></RouteGuard>) },






  //staff permissions
  { path: `${import.meta.env.BASE_URL}/staff-permissions`, element: (<RouteGuard requiredRoles={["Admin"]} requiredPermissions={[]}><StaffPermission /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/staff-permissions/staff`, element: (<RouteGuard requiredRoles={["Admin"]} requiredPermissions={[]}><StaffUsers /></RouteGuard>) },



  { path: `${import.meta.env.BASE_URL}/staff-login`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "LoginData", action: "view" }]}><StaffLogin /></RouteGuard>) },

];