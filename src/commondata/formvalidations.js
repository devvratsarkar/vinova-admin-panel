import * as Yup from "yup";

const FILE_SIZE_LIMIT = 2 * 1024 * 1024;

export const UserLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("This field is required"),
  password: Yup.string().required("This field is required"),
});

export const passwordResetSchema = Yup.object().shape({
  password: Yup.string().required("This field is required"),
  password_confirmation: Yup.string().required("This field is required"),
});
export const ResetEmail = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("This field is required"),
});

export const UserResgistrationSchema = Yup.object().shape({
  full_name: Yup.string().required("This field is required"),
  mobile_number: Yup.string()
    .required("This field is required")
    .matches(/^[0-9+\-() ]+$/, "Invalid phone number format")
    .typeError("Phone number must be a number"),
  email: Yup.string()
    .email("Enter a valid email address")
    .required("This field is required"),
  password: Yup.string().required("This field is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Confirm Password must Match")
    .required("This field is required"),
  term_conditions: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});
export const AddNewProductSchema = Yup.object().shape({
  product_name: Yup.string().required("This field is required"),
  featured_image: Yup.string().required("Featured image is required"),
  category: Yup.array().min(1, "This Field is required.").required("Categories are required"),
  status: Yup.string().required("This field is required"),
  slug: Yup.string().required("This field is required"),
  marketer: Yup.string().required("This field is required"),
  brand: Yup.string().required("This field is required"),
  hsn_code: Yup.string(),
  weight: Yup.number()
    .min(1, "Minimum 1 Gram")
    .required("This field is required"),
  // length: Yup.number(),
  // width: Yup.number(),
  // height: Yup.number(),
  tags: Yup.array(),
  minimum_order_quantity: Yup.number().required("This field is required"),
  tax_percentage: Yup.number().required("This field is required"),
  linked_items: Yup.array(),
  short_description: Yup.string(),
  packOf: Yup.string().required("This field is required."),
  form: Yup.string().required("This field is required."),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
  uses: Yup.string().required("This Field is required."),
  age: Yup.array().of(
    Yup.object().shape({
      value: Yup.string().required("This field is required."),
      label: Yup.string().required("This field is required."),
    })
  ).required("This field is required."),
  // tax_percent: Yup.number().required("This field is required.")
});
export const SurgicalEquipmentSchema = Yup.object().shape({
  product_name: Yup.string().required("This field is required"),
  featured_image: Yup.string().required("This field is required"),
  status: Yup.string().required("This field is required"),
  slug: Yup.string().required("This field required"),
  // marketer: Yup.string().required("This field is required"),
  minimum_order_quantity: Yup.number().min(1, "Minimum value must be 1 or greater.").required("This field is required."),
});

// export const AddNewCategorySchema = Yup.object().shape({
//   category_name: Yup.string().required("This field is required"),
//   slug: Yup.string().required("This field is required"),
//   featured_image: Yup.mixed().required("This Field is Required"),
//   product_type: Yup.string().required('Product Type is Required'),
//   // type: Yup.array().min(1, "Atleast select one option")
//   type: Yup.string().required("This field is required"),
//   banner_one: Yup.mixed().required("This Field is Required"),
//   banner_two: Yup.mixed().required("This Field is Required"),
// });
export const AddNewCategorySchema = Yup.object().shape({
  category_name: Yup.string().required("This field is required"),
  slug: Yup.string().required("This field is required"),
  type: Yup.array()
    .of(Yup.string().oneOf(["Men", "Women", "Kid"]))
    .min(1, "At least one type must be selected")
    .required("This field is required"),
  featured_image: Yup.mixed().when("type", {
    is: (type) => Array.isArray(type) && type.includes("Men"),
    then: () => Yup.mixed().required("Featured Image for Men is required"),
    otherwise: () => Yup.mixed().notRequired(),
  }),
  featured_image_women: Yup.mixed().when("type", {
    is: (type) => Array.isArray(type) && type.includes("Women"),
    then: () => Yup.mixed().required("Featured Image for Women is required"),
    otherwise: () => Yup.mixed().notRequired(),
  }),
  featured_image_kid: Yup.mixed().when("type", {
    is: (type) => Array.isArray(type) && type.includes("Kid"),
    then: () => Yup.mixed().required("Featured Image for Kid is required"),
    otherwise: () => Yup.mixed().notRequired(),
  }),
  mega_menu_image: Yup.mixed().when("is_mega_menu", {
    is: true,
    then: () =>
      Yup.mixed()
        .required("Mega Menu Image is required")
        .test("fileOrUrl", "Mega Menu Image is required", (value) => {
          if (typeof value === "string" && value.trim().length > 0) return true;
          if (value instanceof File) return true;
          return false;
        }),
    otherwise: () => Yup.mixed().notRequired(),
  }),
  product_type: Yup.string().required("Product Type is required"),
  banner_one: Yup.mixed().required("This field is required"),
  banner_two: Yup.mixed().required("This field is required"),
  status: Yup.boolean().required("Status is required"),
});

export const AddCustomFieldSchema = Yup.object().shape({
  attribute_type: Yup.string().required("This field is required"),
  attribute_name: Yup.string().required("This field is required"),
  list_order: Yup.number()
    .required("This field is required")
    .min(0, "List order can not be negative."),
  category_id: Yup.array()
    .required("This field is required")
    .min(1, "This field is required"),
});
export const AddCustomFieldValueSchema = Yup.object().shape({
  attribute_type: Yup.string(),
  attribute_name: Yup.string().required("This field is required"),
  list_order: Yup.number()
    .required("This field is required")
    .min(0, "List order can not be negative."),
});

export const AddNewOrder = Yup.object().shape({
  order_type: Yup.string().required("This field is required."),
  customer: Yup.string().required("This field is required."),
});
export const EditVariantSchema = Yup.object().shape({
  strength: Yup.string().required("This field is required."),
  size: Yup.array()
    .required("This field is required.")
    .min(1, "At least one size must be selected."),
  tags: Yup.array()
    .required("This field is required.")
    .min(1, "At least one tag must be selected."),
});
export const AddInventoryWithVariantSchema = Yup.object().shape({
  // sku: Yup.string(),
  image: Yup.array()
    .of(Yup.mixed())
    .min(1, "This field is required.")
    .typeError("This field is required.")
    .required("This field is required."),
  stock_quantity: Yup.number().typeError("This field is required.").required("This field is required."),
  // mrp: Yup.number().typeError("This field is required.").min(0, "This field can not be negative.").required("This field is required."),
  // selling_price: Yup.number().typeError("This field is required.").min(0, "This field can not be negative.").required("This field is required."),
  // discount_percent: Yup.number().typeError("This field is required.").min(0, "This field can not be negative.").required("This field is required."),
});

export const AddNewCarrierSchema = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  tracking_url: Yup.string().required("This field is required."),
  phone: Yup.number()
    .required("This field is required.")
    .typeError("Phone Number must be a number"),
  email: Yup.string().required("This field is required."),
  logo: Yup.string(),
  status: Yup.boolean(),
});

export const AddCustomerForm = Yup.object().shape({
  name: Yup.string()
    .required("This Field is required.")
    .max(255, "Full name must be 50 characters or less."),
  phone_number: Yup.number()
    .required("This field is required.")
    .typeError("Phone Number must be a number"),
  email: Yup.string().required("This field is required."),
  password: Yup.string()
    .required("This Field is required.")
    .min(8, "Password must be at least 8 characters long."),
  password_confirmation: Yup.string()
    .required("This Field is required.")
    .oneOf(
      [Yup.ref("password")],
      "Password and Confirm Password must be the same."
    ),
  address_line_one: Yup.string().required("This field is required."),
  city: Yup.string().required("This field is required."),
  state: Yup.string().required("This field is required."),
  postal_code: Yup.number()
    .required("This field is required.")
    .typeError("Zip code must be a number"),
  country: Yup.string().required("This field is required."),
  gender: Yup.string().required("This field is required.")
});
export const EditCustomerForm = Yup.object().shape({
  name: Yup.string()
    .required("This Field is required.")
    .max(255, "Full name must be 50 characters or less."),
  phone_number: Yup.number()
    .required("This field is required.")
    .typeError("Phone Number must be a number"),
  email: Yup.string().required("This field is required."),
  address_line_one: Yup.string().required("This field is required."),
  city: Yup.string().required("This field is required."),
  state: Yup.string().required("This field is required."),
  postal_code: Yup.number()
    .required("This field is required.")
    .typeError("Zip code must be a number"),
  country: Yup.string().required("This field is required."),
});

export const AddCoupounSchema = Yup.object().shape({
  couponCode: Yup.string().required("This Field is required."),
  couponType: Yup.object().required("This field is required."),
  value: Yup.number()
    .required("This Field is required")
    .min(1, "INR value must be at least 1")
    .typeError("Value must be a number"),
  number_coupon: Yup.number().min(1, "This field can not be negative.").required("This field is required."),
  expirey_date: Yup.string().required("This field is required."),
  minimum_cart_value: Yup.number().min(1, "This field can not be negative.").required("This field is required."),
  usd: Yup.number(),
  euro: Yup.number(),
  gbp: Yup.number(),
  description: Yup.string()
  // status: Yup.boolean(),
});
export const AddPromocodeSchema = Yup.object().shape({
  promocode_code: Yup.string().required("This Field is required."),
  promocode_type: Yup.string().required("This field is required."),
  amount: Yup.string().required("This Field is required,"),
  number_of_promocode: Yup.number().required("This field is required."),
  expirey_date: Yup.string().required("This field is required."),
  status: Yup.string(),
});
export const AddNewPageValidation = Yup.object().shape({
  page_title: Yup.string().required("This field is required."),
  page_type: Yup.string().required("This field is required."),
  banner_image: Yup.string().required("This field is required."),
  status: Yup.string().required("This field is required."),
  slug: Yup.string(),
  content: Yup.string().required("This field is required."),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
});

export const AddEmailTemplateValidation = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  template_type: Yup.string().required("This field is required."),
  template_for: Yup.string().required("This field is required."),
  status: Yup.string().required("This field is required."),
  sender_name: Yup.string().required("This field is required."),
  sender_email: Yup.string().required("This field is required."),
  subject: Yup.string().required("This field is required."),
  short_codes: Yup.string().required("This field is required."),
  body: Yup.string().required("This field is required."),
});

export const AddDynamicContentValidation = Yup.object().shape({
  type: Yup.string().required("This field is requied"),
  banner_image: Yup.string().required("This field is requied"),
  slug: Yup.string().required("This field is requied"),
  content: Yup.string().required("This field is requied"),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
});

export const AddTopicValidation = Yup.object().shape({
  topic_name: Yup.string().required("This field is required."),
  for: Yup.string().required("This field is required."),
  status: Yup.string().required("This field is required."),
});

export const AddFAQValidation = Yup.object().shape({
  topic: Yup.string().required("This field is required."),
  status: Yup.string().required("This field is required."),
  question: Yup.string().required("This field is required."),
  answer: Yup.string().required("This field is required."),
});

export const AddZoneValidation = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  status: Yup.mixed().required("This field is required."),
  country_id: Yup.array()
    .required("This field is required.")
    .min(1, "This field is required."),
});

export const AddRateValidation = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  carrier_id: Yup.string().required("This field is required."),
  delivery_takes: Yup.string()
    .required("This field is required."),
  mini_order: Yup.number().min(1, "This field can not be negative.")
    .required("This field is required."),
  max_order: Yup.number()
    .required("This field is required.")
    .test(
      "is-greater-than-minimum",
      "Maximum order must be greater than minimum order",
      function (value) {
        const minimumOrder = this.parent.mini_order;
        return value > minimumOrder;
      }
    ),
  rate: Yup.number()
    .required("This field is required.")
    .typeError("Rate must be a number"),
  free_shipping: Yup.boolean().required("This field is required."),
});

export const AddBlogsValidation = Yup.object().shape({
  title: Yup.string().required("This field is required."),
  banner_image: Yup.mixed()
    .required("This field is required.")
    .test("fileSize", "File size should be less than 2MB", (value) => {
      // Existing image URL from API — skip size check on edit
      if (typeof value === "string" && value.trim().length > 0) return true;
      if (value instanceof File) return value.size <= FILE_SIZE_LIMIT;
      return false;
    }),
  status: Yup.string().required("This field is required"),
  slug: Yup.string().required("This field is required."),
  tags: Yup.array(),
  excerpt: Yup.string().required("This field is required."),
  category: Yup.mixed().required("This field is required."),
  content: Yup.string().required("This field is required."),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
});

export const AddBlogsCategoryValidation = Yup.object().shape({
  category_name: Yup.string().required("This field is required."),
  slug: Yup.string().required("This field is required."),
  banner_image: Yup.mixed().required("This field is required."),
});

export const AddTestimonialsValidation = Yup.object().shape({
  customer_name: Yup.string().required("This field is requied"),
  rating: Yup.number()
    .required("This field is requied")
    .min(1, "Minimum one rating is required")
    .max(5, "Maximum five rating is allowed"),
  image: Yup.string().required("This field is requied"),
  status: Yup.boolean().required("This field is requied"),
  designation: Yup.string().required("This field is requied"),
  content: Yup.string(),
});

export const salesBannerSchema = Yup.object().shape({
  banner_image: Yup.mixed().required("This field is required."),
  link: Yup.string().required("This field is required."),
  status: Yup.boolean(),
});

export const returnCancellationPolicyValidation = Yup.object().shape({
  category: Yup.string().required("This field is required"),
  subject: Yup.string().required("This field is required"),
  message: Yup.string().required("This field is required"),
});

export const EditInventoryWithoutVariantdatasValidation = Yup.object().shape({
  sku: Yup.string().trim().required("This field is required"),
  stock_quantity: Yup.number()
    .required("This field is requied")
    .typeError("Stock quantity must be a number"),
  // mrp: Yup.number()
  //   .required("This field is requied")
  //   .typeError("Price must be a number"),
  // selling_price: Yup.number()
  //   .required("This field is required")
  //   .typeError("Offer price must be a number")
  //   .test(
  //     "offer-price-less-than-mrp",
  //     "Offer price must be less than or equal to MRP",
  //     function (value) {
  //       const mrp = this.parent.mrp;
  //       return value <= mrp;
  //     }
  //   ),
  discount_percent: Yup.number().typeError("Offer price must be a number"),
  // product_img: Yup.string().required("This field is requied"),
});

export const SystemSettingValidation = Yup.object().shape({
  marketplace_name: Yup.string().required("This field is requied"),
  legal_name: Yup.string().required("This field is requied"),
  email_address: Yup.string().required("This field is requied"),
  business_area: Yup.string().required("This field is requied"),
  country: Yup.string().required("This field is requied"),
  brand_logo: Yup.string(),
  icon: Yup.string(),
});

export const GlobalSettingsValidation = Yup.object().shape({
  google_analytics_id: Yup.string(),
  google_tag_manager: Yup.string(),
  search_console: Yup.string(),
  facebook_pixel: Yup.string(),
  bing_tracking_code: Yup.string(),
  microsoft_clarity: Yup.string(),
  logo: Yup.string(),
  icon_image: Yup.string(),
  email: Yup.string(),
  phone: Yup.string(),
  whatsapp_link: Yup.string(),
  alt_phone: Yup.string(),
  android_app_url: Yup.string(),
  iphone_app_url: Yup.string(),
  copy_right_text: Yup.string(),
  marketplace_name: Yup.string(),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
  address: Yup.string(),
  head: Yup.object().shape({
    number: Yup.string(),
    help_link: Yup.string(),
  }),
  language: Yup.array()
    .min(1, "Please select at least one language")
    .required("Languages are required"),
  head_items: Yup.array()
    .of(
      Yup.object().shape({
        text: Yup.string().trim().required("Header text is required"),
        btn_name: Yup.string().trim().required("Button name is required"),
        btn_link: Yup.string().trim().required("Button link is required"),
      })
    )
    .min(1, "At least one header item is required"),
});

export const DesputeTextValidation = Yup.object().shape({
  dispute_right_text: Yup.string().required("This field is required"),
  dispute_left_text: Yup.string().required("This field is required"),
});

export const addClientValidations = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  link: Yup.string().required("This field is required."),
  status: Yup.boolean(),
});

export const ReplyDesputeValidation = Yup.object().shape({
  status: Yup.string().required("This field id required."),
  upload_attachment: Yup.string().required("This field id required."),
  content: Yup.string().required("This field id required."),
});

export const AddNewMedicineSchema = Yup.object().shape({
  product_name: Yup.string().required("This field is required"),
  // featured_image: Yup.string().required("This field is required"),
  status: Yup.string().required("This field is required"),
  slug: Yup.string().required("This field is required"),
  category: Yup.array().min(1, "This Field is required.").required("Categories are required"),
  generic_name: Yup.string().required("This field is required"),
  composition: Yup.string().required("This field is required"),
  strength: Yup.string().required("This field is required"),
  storage: Yup.string().required("This field is required"),
  form: Yup.string().required("This field is required"),
  indication: Yup.string().required("This field is required"),
  packOf: Yup.string().required("This field is required"),
  marketer: Yup.string().required("This field is required"),
  brand: Yup.string().required("This field is required"),
  weight: Yup.number()
    .required("This field is required")
    .typeError("Weight must be a number"),
  minimum_order_quantity: Yup.number().min(1, "This field can not have negative values.").required("This field is required"),
  uses: Yup.string().required("This field is required."),
  age: Yup.array().min(1, "This Field is required.").required("This field is required."),
  substitute_product: Yup.array().required("This field is required."),
  tax_percentage: Yup.number().required("This field is required")
});

export const AddNewSpecificationValidation = Yup.object().shape({
  product: Yup.string().required("This field is rerquied."),
  message: Yup.string().required("This field is rerquied."),
});

export const AddNewManuFacturerValidation = Yup.object().shape({
  manufacturer_name: Yup.string().required("This field is required"),
  status: Yup.boolean(),
  description: Yup.string()
});

export const AddBrandValidation = Yup.object().shape({
  name: Yup.string().required("This field is required"),
  slug: Yup.string().required("This field is required"),
  type: Yup.string().required("This field is required"),
  featured_image: Yup.mixed().required("This field is required")
});

export const productReviewValidation = Yup.object().shape({
  // product: Yup.string().required("This field is required."),
  // images: Yup.string().required("This field is required."),
  // customer: Yup.string().required("This field is required."),
  // star_rating: Yup.number()
  //   .required("This field is required.")
  //   .typeError("Rating must be a number.")
  //   .max(5, "Rating must be between 0 and 5."),
  // status: Yup.boolean().required("This field is required."),
  // youtube_video_link: Yup.string(),
  // text_content: Yup.string().required("This field is required."),
});

export const PrivacyPolicyValidation = Yup.object().shape({
  page_title: Yup.string().required("This field is required."),
  heading: Yup.string().required("This field is required."),
  content: Yup.string().required("This field is required."),
})


export const CMSTermsConditionValidation = Yup.object().shape({
  page_title: Yup.string().required("This field is required."),
  heading: Yup.string().required("This field is required."),
  content: Yup.string().required("This field is required."),
  thumbnail: Yup.string(),
  video: Yup.string(),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
});

export const CMSShippingPolicyValidation = Yup.object().shape({
  page_title: Yup.string().required("This field is required."),
  heading: Yup.string().required("This field is required."),
  content: Yup.string().required("This field is required."),
});

export const CMSRefundReturnPolicyValidation = Yup.object().shape({
  page_title: Yup.string().required("This field is required."),
  heading: Yup.string().required("This field is required."),
  content: Yup.string().required("This field is required."),
  thumbnail: Yup.string(),
  video: Yup.string(),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
});

export const CMSCustomerSupportPolicyValidation = Yup.object().shape({
  page_title: Yup.string().required("This field is required."),
  heading: Yup.string().required("This field is required."),
  content: Yup.string().required("This field is required."),
  banner_image: Yup.string(),
  video: Yup.string(),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
});
export const CMSCouponContentPage = Yup.object().shape({
  content: Yup.string().required("This field is required."),
  banner_image: Yup.string(),
});

export const AddNotificationValidation = Yup.object().shape({
  to: Yup.array()
    .required("This field is required.")
    .min(1, "This field is required."),
  title: Yup.string().required("This field is required"),
  content: Yup.string().required("This field is required."),
  date: Yup.string().required("This field is required."),
  time: Yup.string().required("This field is required."),
  product_type: Yup.string().required("This field is required."),
  category: Yup.array().min(1, "Select at least one category"),
});
export const AddNotificationValidationWithouSchedule = Yup.object().shape({
  to: Yup.array()
    .required("This field is required.")
    .min(1, "This field is required."),
  title: Yup.string().required("This field is required"),
  content: Yup.string().required("This field is required."),
  product_type: Yup.string().required("This field is required."),
  category: Yup.array().min(1, "Select at least one category"),
});

export const AddPushNotificationValidation = Yup.object().shape({
  to: Yup.array()
    .required("This field is required.")
    .min(1, "This field is required."),
  type: Yup.array().min(1, "Select at least one option"),
  title: Yup.string().required("This field is required"),
  // url: Yup.string().required("This field is required."),
  content: Yup.string().required("This field is required."),
  date: Yup.string().required("This field is required."),
  time: Yup.string().required("This field is required."),
  product_type: Yup.string().required("This field is required."),
  category: Yup.array().min(1, "Select at least one category"),
});
export const AddPushNotificationValidationWithouSchedule = Yup.object().shape({
  to: Yup.array()
    .required("This field is required.")
    .min(1, "This field is required."),
  type: Yup.array().min(1, "Select at least one option"),
  title: Yup.string().required("This field is required"),
  // url: Yup.string().required("This field is required."),
  content: Yup.string().required("This field is required."),
  product_type: Yup.string().required("This field is required."),
  category: Yup.array().min(1, "Select at least one category"),
});
export const OrderDetailsValidation = Yup.object().shape({
  status: Yup.string().required("This field is required."),
  reason: Yup.string().required("This field is required."),
});

export const ReviewValidations = Yup.object().shape({
  customer: Yup.string().required("This field is required."),
  product: Yup.string().required("This field is required."),
  slug: Yup.string().required("This field is required."),
  star_rating: Yup.number()
    .min(1, "Minimum 1 Star Rating")
    .max(5, "Maximum 5 Star Rating")
    .required("This field is required."),
  text_content: Yup.string().required("This field is required"),
  images: Yup.mixed().required("Tis field is required")
});

export const TagsValidationForm = Yup.object().shape({
  name: Yup.string().required("This field is required"),
  slug: Yup.string(),
});
export const contactUsValidation = Yup.object().shape({
  email_details: Yup.string().required("This field is required"),
  phone_number_one: Yup.string()
    .required("This field is required.")
    .typeError("Phone number one must be a number."),
  phone_number_two: Yup.string().typeError(
    "Phone number two must be a number."
  ),
  banner_image: Yup.string().required("This field is required.")
});

export const CareerPageValidation = Yup.object().shape({
  image_one: Yup.string().required("This field is required."),
  image_five: Yup.string().required("This field is required."),
  image_ten: Yup.string().required("This field is required."),
  section_one: Yup.object().shape({
    banner_text: Yup.string().required("This field is required"),
  }),
});

export const AboutUsValidation = Yup.object().shape({
  section_two: Yup.object().shape({
    heading: Yup.string().required("This field is required"),
    text: Yup.string().required("This field is required"),
    box_heading_one: Yup.string().required("This field is required"),
    box_heading_two: Yup.string().required("This field is required"),
    box_heading_three: Yup.string().required("This field is required"),
    box_heading_four: Yup.string().required("This field is required"),
  }),
  section_three: Yup.object().shape({
    text: Yup.string().required("This field is required"),
  }),
  section_five: Yup.object().shape({
    text: Yup.string().required("This field is required"),
  }),
  // section_six: Yup.object().shape({
  //   founders_name: Yup.string().required("This field is required"),
  //   text: Yup.string().required("This field is required")
  // }),
  image_one: Yup.string().required("This field is required"),
  image_two: Yup.string().required("This field is required"),
  image_three: Yup.string().required("This field is required"),
  image_four: Yup.string().required("This field is required"),
  image_five: Yup.string().required("This field is required"),
  image_six: Yup.string().required("This field is required"),
  image_seven: Yup.string().required("This field is required"),
  image_eight: Yup.string().required("This field is required"),
  image_nine: Yup.string().required("This field is required"),
  image_ten: Yup.string().required("This field is required"),
  image_eleven: Yup.string().required("This field is required"),
  image_twelve: Yup.string().required("This field is required"),
  image_thirteen: Yup.string().required("This field is required"),
  image_fourteen: Yup.string().required("This field is required"),
  image_fifteen: Yup.string().required("This field is required"),
  image_sixteen: Yup.string().required("This field is required"),
  image_seventeen: Yup.string().required("This field is required"),
  image_eighteen: Yup.string().required("This field is required"),
});

export const AddCmsJobApplicatioValidation = Yup.object().shape({
  title: Yup.string().required("This field is required"),
  slug: Yup.string().required("This field is required"),
  no_positions: Yup.string().required("This field is required"),
  location: Yup.string().required("This field is required"),
  category: Yup.string().required("This field is required"),
  work_type: Yup.string().required("This field is required"),
  experience: Yup.string().required("This field is required"),
  status: Yup.string().required("This field is required"),
  description: Yup.string().required("This field is required"),
  banner_image: Yup.string().required("This field is required"),
});

export const AddNewMediaValidation = Yup.object().shape({
  // name: Yup.string().required("This field is required"),
  image: Yup.array().required("This field is required")
})

export const AddNewUsesValidation = Yup.object().shape({
  name: Yup.string().required("This field is required.")
})
export const AdminProfileValidation = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  email: Yup.string().required("This field is required."),
  dob: Yup.date().required("This field is required."),
  phone_number: Yup.string().required("Thid field is required."),
  // profile_pic: Yup.string(),
})

export const ChangePasswordValidation = Yup.object().shape({
  oldPassword: Yup.string().required("This field is required."),
  newPassword: Yup.string().required("This field is required."),
  confirmPassword: Yup.string().required("This field is required."),

})

export const DisputeMessageValidation = Yup.object().shape({
  message: Yup.string().required("This field id required.")
})

export const AddStaffValidation = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  email: Yup.string().required("This field is required."),
  phone_number: Yup.string().required("This field is required."),
  profile_pic: Yup.mixed().required("This field is required."),
  password: Yup.string().required("This field is required."),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("This field is required."),
  role_id: Yup.string().required("Please select a role."),
})

export const EditStaffValidation = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  email: Yup.string().required("This field is required."),
  phone_number: Yup.string().required("This field is required."),
  role_id: Yup.string().required("Please select a role."),
})

export const AddRoleValidation = Yup.object().shape({
  role_name: Yup.string().required("This field is required."),
})

export const AddPopUpValidation = Yup.object().shape({
  type: Yup.string().required("This Field is required."),
  image: Yup.string().required("This field is reqired")
})

export const CurrencySettingValidation = Yup.object().shape({
  usd_price: Yup.number().min(1, "This field can not be negative").required("This field is required.")
})



//frames
export const FrameValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  slug: Yup.string().required("Slug is required"),
  featured_image: Yup.mixed().required("Featured Image is required"),
  category: Yup.string().required("Category is required"),
  brand: Yup.string().required("Brand is required"),
  gender: Yup.string().required("Gender is required"),
  frame_type: Yup.string().required("Frame type is required"),
  type: Yup.string().required("Type is required"),
  status: Yup.boolean().required("Status is required"),
  short_desc: Yup.string().required("Short Description is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.boolean().required("Status is required"),
  material: Yup.string().required("Material is required"),
});
export const ContactLensValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  slug: Yup.string().required("Slug is required"),
  featured_image: Yup.mixed().required("Featured Image is required"),
  category: Yup.array().min(1, "Select at least one category"),
  brand: Yup.string().required("Brand is required"),
  gender: Yup.string().required("Gender is required"),
  contact_lens_type: Yup.string().required("Contact Lens Type is required"),
  status: Yup.boolean().required("Status is required"),
  short_desc: Yup.string().required("Short Description is required"),
  description: Yup.string().required("Description is required"),
  material: Yup.string().required("Material is required"),
  gallery_image: Yup.array(),
  country_origin: Yup.string(),
  type: Yup.string().default("contact-lens"),
  usage_duration: Yup.string(),
  toric_lens: Yup.boolean().default(true),
  base_curv: Yup.string(),
  diameter: Yup.string(),
  contact_water_content: Yup.string(),
  lens_color: Yup.string(),
});
export const accessoriesValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  slug: Yup.string()
    .required("Slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and hyphen-separated"),
  status: Yup.boolean().required("Status is required"),
  featured_image: Yup.mixed()
    .required("Featured image is required"),
  short_desc: Yup.string().required("Short description is required"),
  category: Yup.array().min(1, "At least one category is required"),
  brand: Yup.string().required("Brand is required"),
  box_content: Yup.string(), // optional
  description: Yup.string().required("Description is required"),
  material: Yup.string().required("Material is required"),
  country_origin: Yup.string(),
});


export const lensValidationSchema = Yup.object({
  name: Yup.string().required("Name Field is Required"),
  slug: Yup.string().required("Slug Field is Required"),
  image: Yup.mixed().required("Image Field is Required"),
  type: Yup.string().required("Type Field is Required"),
  price: Yup.string().required("Price Field is Required"),
  warranty: Yup.string().required("Warranty Field is Required"),
  status: Yup.boolean().required("Status Field is Required"),
})

export const filterValidationSchema = Yup.object({
  name: Yup.string().required("Name Field is Required"),
  slug: Yup.string().required("Slug Field is Required"),
  type: Yup.string().nullable().notRequired(),
  price: Yup.string().required("Price Field is Required"),
  status: Yup.boolean().required("Status Field is Required"),
  filters: Yup.array()
    .of(
      Yup.string()
        .trim()
        .required('Each filter must not be empty')
    )
    .min(1, 'At least one filter is required')
    .required('Filters are required'),
  isPhotochromic: Yup.boolean().required("Photochromic Field is Required"),
  lensColor: Yup.array().when('isPhotochromic', {
    is: true,
    then: schema => schema.min(1, "At least one lens color is required when photochromic is enabled").required("Lens Color is Required"),
    otherwise: schema => schema.notRequired()
  }),
  lens: Yup.array().of(Yup.string()).notRequired(),
});

export const lensThicknessValidationSchema = Yup.object({
  name: Yup.string().required("Name Field is Required"),
  slug: Yup.string().required("Slug Field is Required"),
  type: Yup.array().min(1, "At least one type is required").required("Type Field is Required"),
  lens: Yup.array()
    .of(Yup.string())
    .min(1, "At least one lens quality category is required")
    .required("Lens quality category is Required"),
  lensPrices: Yup.array().of(
    Yup.object({
      lens: Yup.string().required(),
      price: Yup.string().required("Price is Required"),
    })
  ),
  status: Yup.boolean().required("Status Field is Required"),
  isFree: Yup.boolean().required("Is Free Field is Required"),
  filters: Yup.array()
    .of(
      Yup.string()
        .trim()
        .required('Each filter must not be empty')
    )
    .min(1, 'At least one filter is required')
    .required('Filters are required'),
  lensFilters: Yup.array().of(Yup.string()).notRequired(),
})



export const lensColorvalidationSchema = Yup.object().shape({
  name: Yup.string().required('Lens Color Name is required'),
  code: Yup.string().required('Color Code is required'),
  desc: Yup.string().required('Description is required'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
  status: Yup.boolean().required('Status is required')
})

export const contactLensTypeValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  slug: Yup.string().required('Slug is required'),
  description: Yup.string().required('Description is required'),
  status: Yup.boolean().required('Status is required')
})

export const materialValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  status: Yup.boolean().required('Status is required')
})

export const contactLensTypeEditValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required')
})

export const questionsValidationSchema = Yup.object().shape({
  text: Yup.string().required('Question text is required'),
  type: Yup.string().required('Question type is required'),
  options: Yup.array().when('type', {
    is: (typeValue) => typeValue === 'multiple_choice' || typeValue === 'yes_no',
    then: (currentSchema) => currentSchema.of(
      Yup.object().shape({
        value: Yup.string().required('Option value is required'),
        label: Yup.string().required('Option label is required'),
      })
    ).min(1, 'At least one option is required'),
    otherwise: (currentSchema) => currentSchema,
  }),
  conditions: Yup.array().of(
    Yup.object().shape({

      field: Yup.string().required('Field is required'),
      value: Yup.string().required('Value is required'),
      operator: Yup.string().required('Operator is required'),
    })
  ),
  dependsOn: Yup.object().shape({
    questionId: Yup.string().nullable(),
    answer: Yup.string().nullable(),
  }),
  category: Yup.string().required('Category is required'),
  order: Yup.number()
    .typeError('Order must be a number')
    .required('Order is required')
    .min(1, 'Order must be at least 1'),
  status: Yup.boolean().required('Status is required'),
});

//faq
export const faqValidationSchema = Yup.object().shape({
  question: Yup.string().required("This field is required"),
  answer: Yup.string().required("This field is required")
})


//currency
export const currencValidationSchema = Yup.object({
  name: Yup.string()
    .required('Currency name is required')
    .min(2, 'Currency name must be at least 2 characters'),
  code: Yup.string()
    .required('Currency code is required')
    .matches(/^[A-Z]{3}$/, 'Currency code must be exactly 3 uppercase letters'),
  symbol: Yup.string()
    .required('Currency symbol is required')
    .max(5, 'Currency symbol must be 5 characters or less'),
  country_id: Yup.string()
    .required('Country is required'),
  status: Yup.boolean()
    .required('Status is required')
});


//currency exchannge rate
export const currencExchangeRateValidationSchema = Yup.object({
  base_currency: Yup.string()
    .required('Country is required'),
  target_currency: Yup.string()
    .required('Country is required'),
  rate: Yup.string()
    .required('Country is required'),
  status: Yup.boolean()
    .required('Status is required')
});


const COUPON_REGEX = /^[A-Z0-9]+$/;
const COUPON_MIN = 5;
const COUPON_MAX = 8;

export const couponValidationSchema = Yup.object().shape({
  coupon_code: Yup.string()
    .required("Please enter a discount code")
    .matches(COUPON_REGEX, "The discount code should accept only English letters (A–Z) and numbers (0–9)")
    .min(COUPON_MIN, "Discount code must be between 5 and 8 characters")
    .max(COUPON_MAX, "Discount code must be between 5 and 8 characters"),

  coupon_type: Yup.string()
    .required("Coupon Type is required"),

  value: Yup.number()
    .typeError("Value must be a number")
    .required("Value is required")
    .min(1, "Value must be at least 1"),

  no_coupon: Yup.number()
    .typeError("Number of coupons must be a number")
    .required("No. of coupons is required")
    .min(1, "Must be at least 1"),

  expiry_date: Yup.string()
    .required("Expiry date is required"),

  minimum_cart_value: Yup.number()
    .typeError("Minimum cart value must be a number")
    .required("Minimum cart value is required")
    .min(0, "Cannot be negative"),

  description: Yup.string().nullable(),
  status: Yup.boolean(),
  category: Yup.array().of(Yup.string()), // optional, can be empty
});


export const AddCmsJobApplicationValidation = Yup.object().shape({
  position: Yup.string()
    .required('Position is required')
    .min(2, 'Position must be at least 2 characters')
    .max(100, 'Position cannot exceed 100 characters'),
  status: Yup.boolean()
    .required('Status is required'),
  slug: Yup.string()
    .required('Slug is required')
    .matches(/^[a-z0-9-]+$/i, 'Slug can only contain letters, numbers, and hyphens')
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug cannot exceed 100 characters'),
  work_type: Yup.string()
    .required('Work Type is required')
    .min(2, 'Work Type must be at least 2 characters')
    .max(50, 'Work Type cannot exceed 50 characters'),
  category: Yup.string()
    .required('Category is required')
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category cannot exceed 50 characters'),
  experience: Yup.number()
    .required('Experience is required')
    .min(0, 'Experience cannot be negative')
    .typeError('Experience must be a number'),
  banner: Yup.mixed()
    .required('Banner image is required')
    .test('fileFormat', 'Unsupported file format. Only .jpg, .jpeg, .png, .webp are allowed', (value) => {
      if (!value) return false;
      const supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
      return supportedFormats.includes(value.type);
    })
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return false;
      return value.size <= 5 * 1024 * 1024; // 5MB in bytes
    }),
  location: Yup.string()
    .required('Location is required')
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location cannot exceed 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  requirement: Yup.string()
    .optional()
    .min(10, 'Requirement must be at least 10 characters when provided'),
});


//career
export const careerPageValidationSchema = Yup.object().shape({
  image: Yup.mixed()
    .required('Image is required')
    .test('fileFormat', 'Unsupported file format. Only .jpg, .jpeg, .png, .webp are allowed', (value) => {
      if (!value) return false;
      const supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
      return supportedFormats.includes(value.type);
    })
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return false;
      return value.size <= 5 * 1024 * 1024;
    }),
  title: Yup.string()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  desc: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  btn_txt: Yup.string()
    .required('Button text is required')
    .min(2, 'Button text must be at least 2 characters')
    .max(50, 'Button text cannot exceed 50 characters'),
});



//about us
const ABOUT_US_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const ABOUT_US_IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const isValidAboutUsImageFile = (file) => {
  if (!(file instanceof File)) return false;
  if (ABOUT_US_IMAGE_MIME_TYPES.includes(file.type)) return true;
  const fileName = file.name?.toLowerCase() || '';
  return ABOUT_US_IMAGE_EXTENSIONS.some((ext) => fileName.endsWith(ext));
};

const aboutUsRequiredImageValidation = Yup.mixed()
  .required('Image is required')
  .test('fileOrUrl', 'Image is required', (value) => {
    if (typeof value === 'string' && value.trim().length > 0) return true;
    if (value instanceof File) {
      return isValidAboutUsImageFile(value) && value.size <= 5 * 1024 * 1024;
    }
    return false;
  });

const aboutUsOptionalImageValidation = Yup.mixed()
  .nullable()
  .test('fileFormat', 'Unsupported file format. Only .jpg, .jpeg, .png, .webp allowed', (value) => {
    if (!value) return true;
    if (typeof value === 'string') return true;
    if (value instanceof File) return isValidAboutUsImageFile(value);
    return false;
  })
  .test('fileSize', 'File size must be less than 5MB', (value) => {
    if (!value || typeof value === 'string') return true;
    if (value instanceof File) return value.size <= 5 * 1024 * 1024;
    return false;
  });

export const aboutUsValidationSchema = Yup.object().shape({
  sec1: Yup.object().shape({
    image: aboutUsOptionalImageValidation,
    title: Yup.string().min(2, 'Title must be at least 2 characters').max(100, 'Title cannot exceed 100 characters'),
    desc: Yup.string().min(10, 'Description must be at least 10 characters'),
  }),
  sec2: Yup.object().shape({
    title: Yup.string().min(2, 'Title must be at least 2 characters'),
    desc: Yup.string().min(10, 'Description must be at least 10 characters'),
  }),
  sec3: Yup.object().shape({
    title: Yup.string().min(2, 'Title must be at least 2 characters').max(100, 'Title cannot exceed 100 characters'),
    sub_title: Yup.string().max(200, 'Subtitle cannot exceed 200 characters'),
    first_box: Yup.object().shape({
      image: aboutUsOptionalImageValidation,
      title: Yup.string().min(2, 'Title must be at least 2 characters').max(100, 'Title cannot exceed 100 characters'),
      desc: Yup.string().min(10, 'Description must be at least 10 characters'),
    }),
    second_box: Yup.object().shape({
      image: aboutUsOptionalImageValidation,
      title: Yup.string().min(2, 'Title must be at least 2 characters').max(100, 'Title cannot exceed 100 characters'),
      desc: Yup.string().min(10, 'Description must be at least 10 characters'),
    }),
    third_box: Yup.object().shape({
      image: aboutUsOptionalImageValidation,
      title: Yup.string().min(2, 'Title must be at least 2 characters').max(100, 'Title cannot exceed 100 characters'),
      desc: Yup.string().min(10, 'Description must be at least 10 characters'),
    }),
    forth_box: Yup.object().shape({
      image: aboutUsOptionalImageValidation,
      title: Yup.string().min(2, 'Title must be at least 2 characters').max(100, 'Title cannot exceed 100 characters'),
      desc: Yup.string().min(10, 'Description must be at least 10 characters'),
    }),
  }),
  sec4: Yup.object().shape({
    image: aboutUsOptionalImageValidation,
    txt: Yup.string().min(2, 'Text must be at least 2 characters').max(100, 'Text cannot exceed 100 characters'),
    title: Yup.string().min(2, 'Title must be at least 2 characters').max(100, 'Title cannot exceed 100 characters'),
    sub_desc: Yup.string().min(10, 'Sub-description must be at least 10 characters'),
    desc: Yup.string().min(10, 'Description must be at least 10 characters'),
  }),
  sec5: Yup.object().shape({
    image: aboutUsOptionalImageValidation,
    txt: Yup.string().min(2, 'Text must be at least 2 characters').max(100, 'Text cannot exceed 100 characters'),
    title: Yup.string().min(2, 'Title must be at least 2 characters').max(100, 'Title cannot exceed 100 characters'),
    desc: Yup.string().min(10, 'Description must be at least 10 characters'),
  }),
  sec6: Yup.object().shape({
    image: Yup.array()
      .of(
        Yup.object().shape({
          img: aboutUsOptionalImageValidation,
          name: Yup.string().nullable(),
          position: Yup.string().nullable(),
        })
      )
      .nullable(),
    title: Yup.string().min(2, 'Title must be at least 2 characters').max(100, 'Title cannot exceed 100 characters'),
    desc: Yup.string().min(10, 'Description must be at least 10 characters'),
  }),
  sec7: Yup.object().shape({
    title: Yup.string().min(2, 'Title must be at least 2 characters').max(100, 'Title cannot exceed 100 characters'),
    txt: Yup.string().min(2, 'Text must be at least 2 characters').max(100, 'Text cannot exceed 100 characters'),
    data: Yup.array()
      .of(
        Yup.object().shape({
          title: Yup.string().min(2, 'Title must be at least 2 characters').max(100, 'Title cannot exceed 100 characters'),
          sub_desc: Yup.string().min(10, 'Sub-description must be at least 10 characters'),
          desc: Yup.string().min(10, 'Description must be at least 10 characters'),
        })
      )
      .min(1, 'At least one data item is required'),
  }),
});

export const EditMembershipPlanValidation = Yup.object().shape({
  name: Yup.string().required("Plan name is required"),
  monthly_price: Yup.number().transform((v, o) => (o === '' || o === undefined ? undefined : v)).min(0, "Monthly price cannot be negative").when("is_free", { is: false, then: (schema) => schema.required("Monthly price is required") }),
  yearly_price: Yup.number()
    .transform((v, o) => (o === '' || o === undefined ? undefined : v))
    .min(0, "Yearly price cannot be negative")
    .when("is_free", {
      is: false,
      then: (schema) =>
        schema.required("Yearly price is required").test("max-12x-monthly", function (value) {
          const monthly = Number(this.parent.monthly_price)
          if (value === undefined || !monthly) return true
          const max = monthly * 12
          return Number(value) <= max || this.createError({ message: `Yearly price cannot be more than ${max}` })
        }),
    }),
  platform_fee_percentage: Yup.number().transform((v, o) => (o === '' || o === undefined ? undefined : v)).required("Platform fee is required").min(0).max(100),
  customer_commission_percentage: Yup.number().transform((v, o) => (o === '' || o === undefined ? undefined : v)).required("Give % is required").min(0).max(100),
  optometrist_commission_percentage: Yup.number().transform((v, o) => (o === '' || o === undefined ? undefined : v)).required("Take % is required").min(0).max(100),
  features: Yup.string().trim().required("Features are required"),
});

export const OptometristProfileValidation = Yup.object().shape({
  name: Yup.string().trim().required("Full name is required"),
  specialty: Yup.array().of(Yup.string()),
  address: Yup.string(),
  spoken_languages: Yup.array().of(Yup.string()),
  experience: Yup.string(),
  credentials: Yup.string(),
  about: Yup.string(),
  store_name: Yup.string().trim().required("Clinic / store name is required"),
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
  phone_number: Yup.string().required("Phone number is required"),
  state: Yup.string().required("State is required"),
});

const optionalNumber = (message, min = 0) =>
  Yup.number()
    .transform((value, original) => (original === "" || original === undefined || original === null ? undefined : value))
    .typeError(message)
    .min(min, message);

const slotField = () => optionalNumber("Enter a slot duration of at least 5 minutes", 5).required("Slot duration is required");

const capacityField = () => optionalNumber("Enter a daily capacity of at least 1", 1).required("Daily capacity is required");

const confirmationField = () =>
  Yup.string()
    .transform((value) => (value === "" ? undefined : value))
    .oneOf(["manual", "auto"], "Choose how bookings are confirmed")
    .required("Choose how bookings are confirmed");

const whenVisit = (visits, field) =>
  Yup.mixed().when("type_of_visit", {
    is: (visit) => visits.includes(visit),
    then: () => field(),
    otherwise: (schema) => schema,
  });

export const OptometristWorkingRulesValidation = Yup.object().shape({
  type_of_visit: Yup.string().oneOf(["in_person", "online", "both"]).required("Visit type is required"),
  in_person_fee: Yup.string().when("type_of_visit", {
    is: (visit) => visit === "in_person" || visit === "both",
    then: (schema) => schema.required("In-person fee is required").test("fee", "Enter a valid fee", (value) => value !== "" && Number(value) >= 0),
    otherwise: (schema) => schema,
  }),
  online_fee: Yup.string().when("type_of_visit", {
    is: (visit) => visit === "online" || visit === "both",
    then: (schema) => schema.required("Online fee is required").test("fee", "Enter a valid fee", (value) => value !== "" && Number(value) >= 0),
    otherwise: (schema) => schema,
  }),
  duration_per_slot: whenVisit(["in_person", "online"], slotField),
  daily_capacity: whenVisit(["in_person", "online"], capacityField),
  booking_confirmation: whenVisit(["in_person", "online"], confirmationField),
  in_person_duration: whenVisit(["both"], slotField),
  online_duration: whenVisit(["both"], slotField),
  in_person_capacity: whenVisit(["both"], capacityField),
  online_capacity: whenVisit(["both"], capacityField),
  in_person_confirmation: whenVisit(["both"], confirmationField),
  online_confirmation: whenVisit(["both"], confirmationField),
});

const availabilityDaySchema = Yup.object({
  available: Yup.boolean(),
  start: Yup.string().when("available", {
    is: true,
    then: (schema) => schema.required("Start time is required"),
    otherwise: (schema) => schema,
  }),
  end: Yup.string().when("available", {
    is: true,
    then: (schema) =>
      schema
        .required("End time is required")
        .test("after-start", "End time must be after start time", function (end) {
          const start = this.parent.start;
          return !start || !end || end > start;
        })
        .test("min-window", "Working window must be at least 15 minutes", function (end) {
          const start = this.parent.start;
          if (!start || !end || end <= start) return true;
          const [sh, sm] = String(start).split(":").map(Number);
          const [eh, em] = String(end).split(":").map(Number);
          return eh * 60 + em - (sh * 60 + sm) >= 15;
        }),
    otherwise: (schema) => schema,
  }),
});

const AVAILABILITY_DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const availabilityTimeOffSchema = Yup.object({
  type: Yup.string().oneOf(["vacation", "unavailable"]),
  start: Yup.string().required("Start date is required"),
  end: Yup.string()
    .required("End date is required")
    .test("on-or-after-start", "End date must be on or after the start date", function (end) {
      return !this.parent.start || !end || end >= this.parent.start;
    }),
});

export const OptometristAvailabilityValidation = Yup.object(
  AVAILABILITY_DAY_KEYS.reduce(
    (acc, key) => {
      acc[key] = availabilityDaySchema;
      return acc;
    },
    {
      time_off: Yup.array().of(availabilityTimeOffSchema).test("no-overlap", function (list) {
        const periods = (list || []).filter((item) => item?.start && item?.end);
        const overlap = periods.some((item, index) =>
          periods.some((other, otherIndex) =>
            otherIndex !== index && item.start <= other.end && other.start <= item.end
          )
        );
        if (!overlap) return true;
        return this.createError({ path: "time_off", message: "Time-off periods cannot overlap" });
      }),
    }
  )
).test("at-least-one-day", function (values) {
  if (AVAILABILITY_DAY_KEYS.some((key) => values?.[key]?.available)) return true;
  return this.createError({ path: "hours", message: "Select at least one working day" });
});

export const OptometristRejectEnquiryValidation = Yup.object().shape({
  reason: Yup.string().trim().required("Reason is required"),
});

export const OptometristAcceptEnquiryValidation = Yup.object().shape({
  meeting_link: Yup.string().when("requires_link", {
    is: true,
    then: (schema) =>
      schema
        .trim()
        .required("Meeting link is required when accepting an online consultation")
        .url("Enter a valid meeting URL"),
    otherwise: (schema) => schema.trim(),
  }),
});

export const OptometristRegisterCustomerValidation = Yup.object().shape({
  name: Yup.string().trim().required("Customer name is required"),
  email: Yup.string().trim().transform((value) => value || undefined).email("Enter a valid email address"),
  phone_number: Yup.string().trim().required("Phone number is required"),
});

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹"
const toEnglishDigits = (value) => String(value).replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
const toNumberFromDigits = (_value, original) => {
  if (original === "" || original == null) return undefined
  const parsed = Number(toEnglishDigits(original))
  return Number.isNaN(parsed) ? NaN : parsed
}

const isZeroPower = (value) => !value || value === "0" || value === "0.00"

const eyeHasPrescription = (sph, cyl) => !isZeroPower(sph) || !isZeroPower(cyl)

const formRoot = function () {
  return this.from?.[this.from.length - 1]?.value || {}
}

const eyeShape = (side, otherKey) => Yup.object({
  sph: Yup.string().test("sph-required-if-no-cyl", `SPH (${side}) is required`, function (value) {
    const cyl = this.parent?.cyl
    const other = formRoot.call(this)[otherKey] || {}
    if (!eyeHasPrescription(value, cyl) && eyeHasPrescription(other.sph, other.cyl)) return true
    if (isZeroPower(cyl)) return !isZeroPower(value)
    return true
  }),
  cyl: Yup.string().test("cyl-required", `CYL (${side}) is required`, function (value) {
    const sph = this.parent?.sph
    const other = formRoot.call(this)[otherKey] || {}
    if (!eyeHasPrescription(sph, value) && eyeHasPrescription(other.sph, other.cyl)) return true
    if (isZeroPower(sph)) return !isZeroPower(value)
    return true
  }),
  axis: Yup.string().test("axis-required-if-cyl", `Axis (${side}) is required`, function (value) {
    const cyl = this.parent?.cyl
    const hasCyl = cyl && cyl !== "0" && cyl !== "0.00"
    if (hasCyl) return !!value && value !== "0"
    return true
  }),
})

export const OptometristPrescriptionValidation = Yup.object().shape({
  source: Yup.string().oneOf(["created", "uploaded"]).required(),
  issued_at: Yup.string().required("Issue date is required"),
  valid_until: Yup.string()
    .required("Valid until is required")
    .test("on-or-after-issued", "Valid until must be on or after the issue date", function (end) {
      return !this.parent.issued_at || !end || end >= this.parent.issued_at
    })
    .test("max-two-years", "Prescriptions stay valid for a maximum of 2 years", function (end) {
      const start = this.parent.issued_at
      if (!start || !end) return true
      const issued = new Date(`${start}T00:00:00`)
      const until = new Date(`${end}T00:00:00`)
      const max = new Date(issued)
      max.setFullYear(max.getFullYear() + 2)
      return until <= max
    }),
  doctor_name: Yup.string().when("source", {
    is: "created",
    then: (schema) => schema.trim().required("Doctor's name is required").min(2, "Doctor's name must be at least 2 characters"),
    otherwise: (schema) => schema.trim(),
  }),
  notes: Yup.string(),
  add: Yup.string().when("source", {
    is: "created",
    then: (schema) => schema.test(
      "add-format",
      "ADD must be a valid number (e.g., +1.25, -1.50, 0.00)",
      (value) => !value || /^[+-]?\d+(\.\d{1,2})?$|^0\.00$/.test(value)
    ),
    otherwise: (schema) => schema,
  }),
  right_eye_od: Yup.object().when("source", {
    is: "created",
    then: () => eyeShape("OD", "left_eye_os"),
    otherwise: (schema) => schema.nullable(),
  }),
  left_eye_os: Yup.object().when("source", {
    is: "created",
    then: () => eyeShape("OS", "right_eye_od"),
    otherwise: (schema) => schema.nullable(),
  }),
  pd_value_1: Yup.number()
    .transform(toNumberFromDigits)
    .when("source", {
      is: "created",
      then: (schema) =>
        schema.when("countPd", {
          is: "2",
          then: (inner) => inner.typeError("Value must be a number").required("This field is required").min(16, "Value must be at least 16").max(40, "Value must be at most 40"),
          otherwise: (inner) => inner.typeError("Value must be a number").required("This field is required").min(33, "Value must be at least 33").max(80, "Value must be at most 80"),
        }),
      otherwise: (schema) => schema,
    }),
  pd_value_2: Yup.number()
    .transform(toNumberFromDigits)
    .when(["source", "countPd"], {
      is: (source, countPd) => source === "created" && countPd === "2",
      then: (schema) => schema.typeError("Value must be a number").required("This field is required").min(16, "Value must be at least 16").max(40, "Value must be at most 40"),
      otherwise: (schema) => schema,
    }),
  file: Yup.mixed().when("source", {
    is: "uploaded",
    then: (schema) => schema.required("Upload the prescription file"),
    otherwise: (schema) => schema.nullable(),
  }),
});

export const OptometristServiceFormValidation = Yup.object().shape({
  label: Yup.string().trim().required("Service name is required"),
  description: Yup.string(),
  visit: Yup.string().oneOf(["in_person", "online", "both"]).required("Visit type is required"),
  meeting_link: Yup.string().when("visit", {
    is: (visit) => visit === "online" || visit === "both",
    then: (schema) =>
      schema
        .trim()
        .required("Meeting link is required for online consultations")
        .url("Enter a valid meeting URL"),
    otherwise: (schema) => schema.trim(),
  }),
});

export const RegisterOptometristValidation = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
  phone_number: Yup.string().required("Phone number is required"),
  store_name: Yup.string().required("Store name is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  address: Yup.string().trim().required("Address is required"),
  lat: Yup.number()
    .transform((value, originalValue) => (originalValue === '' || originalValue === null || originalValue === undefined ? undefined : value))
    .typeError("Latitude must be a number")
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .nullable()
    .notRequired(),
  lng: Yup.number()
    .transform((value, originalValue) => (originalValue === '' || originalValue === null || originalValue === undefined ? undefined : value))
    .typeError("Longitude must be a number")
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .nullable()
    .notRequired(),
  password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
  password_confirmation: Yup.string().required("Confirm password is required").oneOf([Yup.ref("password"), null], "Passwords must match"),
  plan: Yup.string().required("Plan is required"),
  plan_type: Yup.string().required("Plan type is required"),
  payment_method: Yup.string().required("Payment method is required"),
});

export const EditOptometristEnquiryValidation = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
  phone_number: Yup.string().required("Phone number is required"),
  country_code: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  plan: Yup.string().required("Plan is required"),
  plan_type: Yup.string().required("Plan type is required"),
  store_name: Yup.string().required("Store name is required"),
  address: Yup.string().trim().required("Address is required"),
  lat: Yup.number()
    .transform((value, originalValue) => (originalValue === '' || originalValue === null || originalValue === undefined ? undefined : value))
    .typeError("Latitude must be a number")
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .nullable()
    .notRequired(),
  lng: Yup.number()
    .transform((value, originalValue) => (originalValue === '' || originalValue === null || originalValue === undefined ? undefined : value))
    .typeError("Longitude must be a number")
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .nullable()
    .notRequired(),
});

//  optometrist 
export const optometristValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  desc: Yup.string().required("Description is required"),
  image: Yup.mixed().required("Image is required"),
  btn_text: Yup.string().required("Button text is required"),
  optometrist_rate: Yup.string().required("Optometrist rate is required"),
  years_expertise: Yup.string().required("Years of expertise is required"),
  evenue_partners: Yup.string().required("eVenue partners is required"),
  happy_customers: Yup.string().required("Happy customers is required"),
  enquiry_title: Yup.string().required("Enquiry title is required"),
  enquiry_desc: Yup.string().required("Enquiry description is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  office_address: Yup.string().required("Office address is required"),
  follow_us: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Social name is required"),
        link: Yup.string().required("Social link is required"),
      })
    )
    .min(1, "At least one social link is required"),
});

// contact us
export const contactValidationSchema = Yup.object({
  label: Yup.string().required('Label is required'),
  main_heading: Yup.string().required('Main heading is required'),
  title: Yup.string().required('Title is required'),
  contact_text: Yup.string().required('Contact text is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  assistance_hours: Yup.string().required('Assistance hours are required'),
});

export const HomePageValidationSchema = Yup.object().shape({
  sec1: Yup.object().shape({
    title: Yup.string().required('Title is required'),
    desc: Yup.string().required('Description is required'),
    banner: Yup.array().min(1, 'At least one banner image is required'),
    first_bnt_name: Yup.string().required('First button name is required'),
    first_btn_link: Yup.string().url('Must be a valid URL').required('First button link is required'),
    sec_btn_name: Yup.string(),
    sec_btn_link: Yup.string().url('Must be a valid URL'),
  }),
  sec5: Yup.object().shape({
    right: Yup.object().shape({
      title: Yup.string().required('Right title is required'),
      desc: Yup.string().required('Right description is required'),
      image: Yup.string().required('Right image is required'),
    }),
    left: Yup.object().shape({
      title: Yup.string().required('Left title is required'),
      desc: Yup.string().required('Left description is required'),
      image: Yup.string().required('Left image is required'),
    }),
  }),
  sec6: Yup.object().shape({
    title: Yup.string().required('Title is required'),
    desc: Yup.string().required('Description is required'),
    data: Yup.object().shape({
      icon: Yup.string().required('Icon is required'),
      title: Yup.string().required('Data title is required'),
      desc: Yup.string().required('Data description is required'),
    }),
  }),
  sec7: Yup.object().shape({
    title: Yup.string().required('Title is required'),
    desc: Yup.string().required('Description is required'),
    right: Yup.object().shape({
      title: Yup.string().required('Right title is required'),
      desc: Yup.string().required('Right description is required'),
      image: Yup.string().required('Right image is required'),
    }),
    left: Yup.object().shape({
      title: Yup.string().required('Left title is required'),
      desc: Yup.string().required('Left description is required'),
      image: Yup.string().required('Left image is required'),
    }),
  }),
  sec8: Yup.object().shape({
    right: Yup.object().shape({
      title: Yup.string().required('Right title is required'),
      desc: Yup.string().required('Right description is required'),
      image: Yup.string().required('Right image is required'),
      eye_specialist: Yup.object().shape({
        images: Yup.array().min(1, 'At least one eye specialist image is required'),
      }),
    }),
    left: Yup.object().shape({
      title: Yup.string().required('Left title is required'),
      desc: Yup.string().required('Left description is required'),
      image: Yup.string().required('Left image is required'),
    }),
  }),
  sec9: Yup.object().shape({
    title: Yup.string().required('Title is required'),
    desc: Yup.string().required('Description is required'),
    shapes: Yup.array().min(1, 'At least one shape is required'),
  }),
  sec10: Yup.object().shape({
    title: Yup.string().required('Title is required'),
    desc: Yup.string().required('Description is required'),
    btn_name: Yup.string().required('Button name is required'),
    btn_link: Yup.string().url('Must be a valid URL').required('Button link is required'),
  }),
  sec11: Yup.object().shape({
    img: Yup.string().required('Image is required'),
    title: Yup.string().required('Title is required'),
    desc: Yup.string().required('Description is required'),
    btn_name: Yup.string().required('Button name is required'),
    btn_link: Yup.string().url('Must be a valid URL').required('Button link is required'),
  }),
  sec12: Yup.object().shape({
    title: Yup.string().required('Title is required'),
    desc: Yup.string().required('Description is required'),
    video: Yup.string().required('Video is required'),
  }),
  sec13: Yup.object().shape({
    image: Yup.string().required('Image is required'),
    t1: Yup.string().required('Text 1 is required'),
    t2: Yup.string().required('Text 2 is required'),
  }),
  sec14: Yup.object().shape({
    right: Yup.object().shape({
      title: Yup.string().required('Right title is required'),
      desc: Yup.string().required('Right description is required'),
      image: Yup.string().required('Right image is required'),
      brand: Yup.string().required('Brand is required'),
    }),
    left: Yup.object().shape({
      title: Yup.string().required('Left title is required'),
      desc: Yup.string().required('Left description is required'),
      image: Yup.string().required('Left image is required'),
      brand: Yup.string().required('Brand is required'),
    }),
  }),
  feature: Yup.array().of(
    Yup.object().shape({
      icon: Yup.string().required('Icon is required'),
      name: Yup.string().required('Name is required'),
    })
  ),
  video_section: Yup.object().shape({
    video: Yup.string().required('Video is required'),
    description: Yup.string().required('Description is required'),
  }),
  meta_title: Yup.string().required('Meta title is required'),
  meta_description: Yup.string().required('Meta description is required'),
});



// affiliate page

export const affiliateValidationSchema = Yup.object({
  banner: Yup.mixed()
    .required('Banner image is required'),
  // .test('fileSize', 'Banner image must be less than 5MB', (value) => !value || value.size <= 5 * 1024 * 1024)
  // .test('fileType', 'Banner must be a valid image (JPEG or PNG)', (value) =>
  //   !value || ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type)
  // ),
  first_image: Yup.mixed()
    .required('First image is required'),
  // .test('fileSize', 'First image must be less than 5MB', (value) => !value || value.size <= 5 * 1024 * 1024)
  // .test('fileType', 'First image must be a valid image (JPEG or PNG)', (value) =>
  //   !value || ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type)
  // ),
  second_image: Yup.mixed()
    .required('Second image is required'),
  // .test('fileSize', 'Second image must be less than 5MB', (value) => !value || value.size <= 5 * 1024 * 1024)
  // .test('fileType', 'Second image must be a valid image (JPEG or PNG)', (value) =>
  //   !value || ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type)
  // ),
  third_image: Yup.mixed()
    .required('Third image is required'),
  // .test('fileSize', 'Third image must be less than 5MB', (value) => !value || value.size <= 5 * 1024 * 1024)
  // .test('fileType', 'Third image must be a valid image (JPEG or PNG)', (value) =>
  //   !value || ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type)
  // ),
  sec1: Yup.object({
    title: Yup.string().required('Title is required'),
    sub_title: Yup.string().required('Subtitle is required'),
    btn_name: Yup.string().required('Button name is required'),
    btn_link: Yup.string().url('Invalid URL').required('Button link is required'),
  }),
  sec2: Yup.object({
    title1: Yup.string().required('Title 1 is required'),
    desc1: Yup.string().required('Description 1 is required'),
    title2: Yup.string().required('Title 2 is required'),
    desc2: Yup.string().required('Description 2 is required'),
    why_join: Yup.string().required('Why Join section is required'),
  }),
  sec3: Yup.object({
    title: Yup.string().required('Section 3 title is required'),
    desc: Yup.string().required('Section 3 description is required'),
    first: Yup.object({
      name: Yup.string().required('Step 1 name is required'),
    }),
    second: Yup.object({
      name: Yup.string().required('Step 2 name is required'),
    }),
    third: Yup.object({
      name: Yup.string().required('Step 3 name is required'),
    }),
    btn_name: Yup.string().required('Button name is required'),
    btn_link: Yup.string().url('Invalid URL').required('Button link is required'),
  }),
  sec4: Yup.object({
    note: Yup.string().required('Note is required'),
    faqs: Yup.array()
      .of(
        Yup.object({
          question: Yup.string().required('Question is required'),
          ans: Yup.string().required('Answer is required'),
        })
      )
      .min(1, 'At least one FAQ is required'),
  }),
});




export const HomeTryOnPageValidationSchema = Yup.object().shape({
  banner: Yup.mixed().required('Banner is required'),
  img1: Yup.mixed().required('Image 1 is required'),
  img2: Yup.mixed().required('Image 2 is required'),
  img3: Yup.mixed().required('Image 3 is required'),
  sec1: Yup.object().shape({
    title: Yup.string().required('Section 1 title is required'),
    desc: Yup.string().required('Section 1 description is required'),
    btn1: Yup.object().shape({
      name: Yup.string().required('Button 1 name is required'),
      link: Yup.string().required('Button 1 link is required').url('Button 1 link must be a valid URL'),
    }),
    btn2: Yup.object().shape({
      name: Yup.string().required('Button 2 name is required'),
      link: Yup.string().required('Button 2 link is required').url('Button 2 link must be a valid URL'),
    }),
  }),
  sec2: Yup.object().shape({
    title: Yup.string().required('Section 2 title is required'),
    first: Yup.object().shape({
      title: Yup.string().required('First title is required'),
      desc: Yup.string().required('First description is required'),
    }),
    second: Yup.object().shape({
      title: Yup.string().required('Second title is required'),
      desc: Yup.string().required('Second description is required'),
    }),
    third: Yup.object().shape({
      title: Yup.string().required('Third title is required'),
      desc: Yup.string().required('Third description is required'),
    }),
  }),
  // home_tryOn_fav: Yup.array().min(1, 'Please select at least one favorite').required('Home Try On Favorites are required'),
  // BestSelling_Frames: Yup.array().min(1, 'Please select at least one best selling frame').required('Best Selling Frames are required'),

});


export const OptometristPageContentValidationSchema = Yup.object().shape({
  // Banner Images
  first_banner: Yup.mixed()
    .required("First banner is required"),

  second_banner: Yup.mixed()
    .required("Second banner is required"),

  // Presence (Multi-select)
  presence: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one location must be selected")
    .required("Presence is required"),

  // Text fields
  services: Yup.string()
    .trim()
    .required("Services description is required")
    .max(1000, "Services description should not exceed 1000 characters"),

  about: Yup.string()
    .trim()
    .required("About section is required")
    .max(1000, "About section should not exceed 1000 characters"),
});

export const OptometristStoreValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .required('Name is required'),
  address: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters')
    .required('Address is required'),
  open_at: Yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .required('Open time is required'),
  close_at: Yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .required('Close time is required')
    .test('after-open', 'Close time must be after open time', function (value) {
      const { open_at } = this.parent;
      if (!value || !open_at) return true;
      const parseTimeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      return parseTimeToMinutes(value) > parseTimeToMinutes(open_at);
    }),
  services: Yup.array()
    .of(Yup.string().required())
    .min(1, 'At least one service is required')
    .required('Services are required'),
  our_presence: Yup.array().min(1, "Select at least one state").required("Required"),
  map_link: Yup.string()
    .url('Must be a valid URL')
    .required('Map link is required'),
  phone_number: Yup.string()
    .matches(/^\+?[\d\s-()]{10,}$/, 'Phone number is not valid')
    .required('Phone number is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .required('Description is required'),
  lat: Yup.number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .required('Latitude is required'),
  long: Yup.number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .required('Longitude is required'),
  status: Yup.boolean()
    .required('Status is required'),
  image: Yup.mixed()
    .required('Image is required')
});



export const AddInventoryWithoutVariantdatasValidation = Yup.object().shape({
  // sku: Yup.string().required("This field is requied"),
  stock_quantity: Yup.number()
    .required("This field is requied")
    .typeError("Stock quantity must be a number"),
  // mrp: Yup.number()
  //   .required("This field is requied")
  //   .typeError("Price must be a number"),
  // selling_price: Yup.number()
  //   .required("This field is required")
  //   .typeError("Offer price must be a number")
  //   .test(
  //     "offer-price-less-than-mrp",
  //     "Offer price must be less than or equal to MRP",
  //     function (value) {
  //       const mrp = this.parent.mrp;
  //       return value <= mrp;
  //     }
  //   ),
  discount_percent: Yup.number().typeError("Offer price must be a number"),
  // product_img: Yup.string().required("This field is requied"),
});
export const changePasssowrdValidation = Yup.object().shape({
  current_password: Yup.string().required("This field is required"),
  password: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).*$/, "Password must include A-Z, a-z, 0-9, and a special character (@, #, $, etc.)").min(8, "Password must be at least 8 characters long").max(20, "Password must be at most 20 characters long").required("This field is required"),
  password_confirmation: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref('password'), null], "Passwords must match")
});

export const policiesValidationSchema = Yup.object().shape({
  type: Yup.string().required("This field is required"),
  title: Yup.string().required("This field is required"),
  banner: Yup.mixed()
    .required("This field is required")
    .test("bannerRequired", "This field is required", (value) => {
      if (value instanceof File) return true;
      if (typeof value === "string" && value.trim().length > 0) return true;
      return false;
    }),
  content: Yup.string()
    .required("This field is required")
    .test("hasContent", "This field is required", (value) => {
      const text = (value || "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
      return text.length > 0;
    }),
  status: Yup.boolean()
    .transform((value, originalValue) => {
      if (originalValue === "true" || originalValue === true) return true;
      if (originalValue === "false" || originalValue === false) return false;
      return value;
    })
    .required("This field is required"),
});

export const policiesEditValidationSchema = Yup.object().shape({
  type: Yup.string().required("This field is required"),
  title: Yup.string().required("This field is required"),
  banner: Yup.mixed()
    .nullable()
    .test("bannerOptional", "Invalid banner file", (value) => {
      if (!value) return true;
      if (value instanceof File) return true;
      if (typeof value === "string" && value.trim().length > 0) return true;
      return false;
    }),
  content: Yup.string()
    .required("This field is required")
    .test("hasContent", "This field is required", (value) => {
      const text = (value || "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
      return text.length > 0;
    }),
  status: Yup.boolean()
    .transform((value, originalValue) => {
      if (originalValue === "true" || originalValue === true) return true;
      if (originalValue === "false" || originalValue === false) return false;
      return value;
    })
    .required("This field is required"),
});


export const addReviewValidationSchema = Yup.object({
  user_id: Yup.string().required("User is required"),
  // type: Yup.string().required("Type is required"),
  itemId: Yup.string().required("Item is required"),
  rating: Yup.number()
    .required("Rating is required")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  text: Yup.string().required("Review text is required"),
});