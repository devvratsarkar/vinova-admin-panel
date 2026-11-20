

export const MENUITEMS = [
  {
    menutitle: "MAIN",
    Items: [
      {
        path: `${import.meta.env.BASE_URL}dashboard`,
        icon: "home",
        type: "link",
        active: false,
        title: "Dashboard",
        permission: "view",
        model: "Dashboard",
        children: [],
      },
      {
        path: `${import.meta.env.BASE_URL}analytics`,
        icon: "bar-chart-2",
        type: "link",
        active: false,
        title: "Analytics",
        permission: "view",
        model: "Dashboard",
        children: [],
      },
    ],
  },
  {
    Items: [
      {
        title: "Order Management",
        icon: "check-circle",
        type: "sub",
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}orders`,
            title: "All Orders",
            active: false,
            related_fields: [`${import.meta.env.BASE_URL}order-detail/:id`],
            type: "link",
            permission: "view",
            model: "Order",
          },
          {
            path: `${import.meta.env.BASE_URL}hto-orders`,
            title: "HTO Orders",
            active: false,
            related_fields: [`${import.meta.env.BASE_URL}hto-order-detail/:id`],
            type: "link",
            permission: "view",
            model: "Order",
          },
          {
            path: `/dispute`,
            type: "link",
            title: "Disputes",
            related_fields: [""],
            active: false,
          },
        ],
      },
    ],
  },
  {
    Items: [
      {
        title: "Affiliate",
        icon: "check-circle",
        type: "sub",
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}affiliate/withdrawal-request`,
            title: "Withdrawal Request",
            active: false,
            type: "link",
            permission: "view",
            model: "WithDrawl",
          },
          {
            path: `${import.meta.env.BASE_URL}affiliate/coupon-request`,
            title: "Coupon Request",
            active: false,
            type: "link",
            permission: "view",
            model: "AffiliateCoupon",
          },
        ],
      },
    ],
  },
  {
    menutitle: "Cart",
    Items: [
      {
        path: `${import.meta.env.BASE_URL}cart`,
        icon: "shopping-cart",
        type: "link",
        active: false,
        title: "Cart",
        permission: "view",
        model: "Cart",
        children: [],
      },
    ],
  },
  {
    menutitle: "Wishlist",
    Items: [
      {
        path: `${import.meta.env.BASE_URL}wishlist`,
        icon: "heart",
        type: "link",
        title: "Wishlist",
        active: false,
      },
    ],
  },
  {
    Items: [
      {
        title: "Shipping",
        icon: "truck",
        type: "sub",
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}shipping/carrier`,
            related_fields: [
              `${import.meta.env.BASE_URL}shipping/carrier-deleted-items`,
              `${import.meta.env.BASE_URL}shipping/carrier/edit-carrier/:id`,
              `${import.meta.env.BASE_URL}shipping/carrier/view-carrier/:id`,
              `${import.meta.env.BASE_URL}shipping/carrier/add-new-carrier`,
            ],
            title: "Carrier",
            type: "link",
            active: false,
            permission: "view",
            model: "Carrier",
          },
          {
            path: `${import.meta.env.BASE_URL}shipping/shipping-zone`,
            title: "Shipping Zone",
            type: "link",
            active: false,
            permission: "view",
            model: "ShippingZone",
          },
        ],
      },
    ],
  },
  {
    Items: [
      {
        title: "Catalogue",
        icon: "book-open",
        type: "sub",
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}catalogue/category`,
            title: "Category",
            active: false,
            related_fields: [
              `${import.meta.env.BASE_URL}catalogue/add-new-category`,
              `${import.meta.env.BASE_URL}catalogue/edit-category/:id`,
              `${import.meta.env.BASE_URL}catalogue/category/:id`,
              `${import.meta.env.BASE_URL}catalogue/category-deleted-items`,
            ],
            type: "link",
            permission: "view",
            model: "Category",
          },
          {
            path: `${import.meta.env.BASE_URL}catalogue/frames`,
            title: "Frame",
            active: false,
            related_fields: [
              `${import.meta.env.BASE_URL}catalogue/frames/add`,
              `${import.meta.env.BASE_URL}catalogue/frames/edit/:id`,
              `${import.meta.env.BASE_URL}catalogue/frames/view/:id`,
              `${import.meta.env.BASE_URL}catalogue/frames/deleted`,
            ],
            type: "link",
            permission: "view",
            model: "Frame",
          },
          {
            path: `${import.meta.env.BASE_URL}catalogue/contact-lenses`,
            title: "Contact Lenses",
            active: false,
            related_fields: [
              `${import.meta.env.BASE_URL}catalogue/contact-lenses/add`,
              `${import.meta.env.BASE_URL}catalogue/contact-lenses/edit/:id`,
              `${import.meta.env.BASE_URL}catalogue/contact-lenses/view/:id`,
              `${import.meta.env.BASE_URL}catalogue/contact-lenses/deleted`,
            ],
            type: "link",
            permission: "view",
            model: "Frame",
          },
          {
            path: `${import.meta.env.BASE_URL}catalogue/accessories`,
            title: "Accessories",
            active: false,
            related_fields: [
              `${import.meta.env.BASE_URL}catalogue/accessories/add`,
              `${import.meta.env.BASE_URL}catalogue/accessories/edit/:id`,
              `${import.meta.env.BASE_URL}catalogue/accessories/view/:id`,
              `${import.meta.env.BASE_URL}catalogue/accessories/deleted`,
            ],
            type: "link",
            permission: "view",
            model: "Accessories",
          },
          {
            path: `${import.meta.env.BASE_URL}catalogue/lenses`,
            title: "Lens quality category",
            active: false,
            related_fields: [
              `${import.meta.env.BASE_URL}catalogue/lens/add`,
              `${import.meta.env.BASE_URL}catalogue/lens/edit/:id`,
              `${import.meta.env.BASE_URL}catalogue/lens/view/:id`,
              `${import.meta.env.BASE_URL}catalogue/lens/deleted`,
            ],
            type: "link",
            permission: "view",
            model: "Lens",
          },
          {
            path: `${import.meta.env.BASE_URL}catalogue/lens-type`,
            title: "Coating",
            active: false,
            related_fields: [
              `${import.meta.env.BASE_URL}catalogue/lens-type/add`,
              `${import.meta.env.BASE_URL}catalogue/lens-type/edit/:id`,
              `${import.meta.env.BASE_URL}catalogue/lens-type/view/:id`,
              `${import.meta.env.BASE_URL}catalogue/lens-type/deleted-list`,
            ],
            type: "link",
            permission: "view",
            model: "LensType",
          },
          {
            path: `${import.meta.env.BASE_URL}catalogue/lens-thickness`,
            title: "Refractive Index",
            active: false,
            related_fields: [
              `${import.meta.env.BASE_URL}catalogue/lens-thickness/add`,
              `${import.meta.env.BASE_URL}catalogue/lens-thickness/edit/:id`,
              `${import.meta.env.BASE_URL}catalogue/lens-thickness/view/:id`,
              `${import.meta.env.BASE_URL}catalogue/lens-thickness/deleted-list`,
            ],
            type: "link",
            permission: "view",
            model: "LensSize",
          },
          {
            path: `${import.meta.env.BASE_URL}catalogue/lens-color`,
            title: "Lens Color (Prescription Lenses)",
            active: false,
            related_fields: [
              `${import.meta.env.BASE_URL}catalogue/lens-color/add`,
              `${import.meta.env.BASE_URL}catalogue/lens-color/edit/:id`,
              `${import.meta.env.BASE_URL}catalogue/lens-color/view/:id`,
              `${import.meta.env.BASE_URL}catalogue/lens-color/deleted-items`,
            ],
            type: "link",
            permission: "view",
            model: "LensColor",
          },
          {
            path: `${import.meta.env.BASE_URL}catalogue/contact-lens-type`,
            title: "Contact Lens Type",
            active: false,
            related_fields: [
              `${import.meta.env.BASE_URL}catalogue/contact-lens-type/add`,
              `${import.meta.env.BASE_URL}catalogue/contact-lens-type/edit/:id`,
              `${import.meta.env.BASE_URL}catalogue/contact-lens-type/view/:id`,
            ],
            type: "link",
            permission: "view",
            model: "ContactLensType",
          },
          {
            path: `${import.meta.env.BASE_URL}catalogue/material`,
            title: "Material",
            active: false,
            related_fields: [
              `${import.meta.env.BASE_URL}catalogue/material/add`,
              `${import.meta.env.BASE_URL}catalogue/material/edit/:id`,
              `${import.meta.env.BASE_URL}catalogue/material/view/:id`,
            ],
            type: "link",
            permission: "view",
            model: "Material",
          },
          {
            path: `${import.meta.env.BASE_URL}catalogue/custom-field`,
            title: "Custom Fields",
            active: false,
            related_fields: [
              `${import.meta.env.BASE_URL}catalogue/custom-field-deleted-items`,
              `${import.meta.env.BASE_URL}catalogue/custom-field-value/:id`,
              `${import.meta.env.BASE_URL}catalogue/custom-field-value-deleted-items`,
            ],
            type: "link",
            permission: "view",
            model: "CustomField",
          },
          {
            path: `${import.meta.env.BASE_URL}questions`,
            title: "Questions",
            active: false,
            related_fields: [
              `${import.meta.env.BASE_URL}question/add`,
              `${import.meta.env.BASE_URL}question/edit/:id`,
              `${import.meta.env.BASE_URL}question/view/:id`,
              `${import.meta.env.BASE_URL}questions/deleted-items`,
            ],
            type: "link",
            permission: "view",
            model: "Question",
          },
          {
            path: `${import.meta.env.BASE_URL}brand`,
            viewPath: `${import.meta.env.BASE_URL}view-brand/`,
            editPath: `${import.meta.env.BASE_URL}edit-brand/`,
            addNewPath: `${import.meta.env.BASE_URL}add-brand`,
            deletedPath: `${import.meta.env.BASE_URL}brand-deleted-items`,
            type: "link",
            related_fields: [
              `${import.meta.env.BASE_URL}view-brand/:id`,
              `${import.meta.env.BASE_URL}edit-brand/:id`,
              `${import.meta.env.BASE_URL}add-brand`,
              `${import.meta.env.BASE_URL}brand-deleted-items`,
            ],
            active: false,
            title: "Brand",
            permission: "view",
            model: "Brand",
          },
          {
            path: `${import.meta.env.BASE_URL}coupons`,
            viewPath: `${import.meta.env.BASE_URL}view-coupon/`,
            editPath: `${import.meta.env.BASE_URL}edit-coupon/`,
            addNewPath: `${import.meta.env.BASE_URL}add-coupon`,
            deletedPath: `${import.meta.env.BASE_URL}coupon/deleted-coupons`,
            type: "link",
            related_fields: [
              `${import.meta.env.BASE_URL}view-coupon/:id`,
              `${import.meta.env.BASE_URL}edit-coupon/:id`,
              `${import.meta.env.BASE_URL}add-coupon`,
              `${import.meta.env.BASE_URL}coupon/deleted-coupons`,
            ],
            active: false,
            title: "Coupon",
            permission: "view",
            model: "Coupon",
          },
        ],
      },
    ],
  },
  {
    Items: [
      {
        title: "Inventory",
        icon: "trending-up",
        type: "sub",
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}stocks/inventory`,
            related_fields: [
              `${import.meta.env.BASE_URL}stocks/inventory-without-variant-delete-items`,
              `${import.meta.env.BASE_URL}stocks/edit-inventory-without-variant/:id`,
              `${import.meta.env.BASE_URL}stocks/view-inventory-without-variant/:id`,
              `${import.meta.env.BASE_URL}stocks/add-inventory-without-variant/:id`,
              `${import.meta.env.BASE_URL}stocks/inventory-with-variant-delete-items`,
              `${import.meta.env.BASE_URL}inventor/edit-invertory-with-varient/:type/:id`,
              `${import.meta.env.BASE_URL}stocks/view-inventory-without-variant/:id`,
            ],
            active: false,
            title: "Inventory With Variant",
            permission: "view",
            model: "InventoryWithVariant",
          },
          {
            path: `${import.meta.env.BASE_URL}stocks/inventory-without-variant`,
            related_fields: [
              `${import.meta.env.BASE_URL}stocks/inventory-without-variant-delete-items`,
              `${import.meta.env.BASE_URL}stocks/edit-inventory-without-variant/:id`,
              `${import.meta.env.BASE_URL}stocks/view-inventory-without-variant/:id`,
              `${import.meta.env.BASE_URL}stocks/add-inventory-without-variant/:id`,
              `${import.meta.env.BASE_URL}stocks/inventory-with-variant-delete-items`,
              `${import.meta.env.BASE_URL}inventor/edit-invertory-with-varient/:type/:id`,
              `${import.meta.env.BASE_URL}stocks/view-inventory-without-variant/:id`,
            ],
            active: false,
            title: "Inventory Without Variant",
            permission: "view",
            model: "InventoryWithOutVariant",
          },
        ],
      },
    ],
  },
  {
    Items: [
      {
        title: "Reviews",
        icon: "star",
        type: "sub",
        active: false,
        children: [
          {
            path: `/reviews`,
            icon: "package",
            type: "link",
            active: false,
            title: "All Reviews",
          },
        ],
      },
    ],
  },
  {
    Items: [
      {
        title: "Customer Data",
        icon: "users",
        type: "sub",
        active: false,
        children: [
          {
            path: `/customer-list`,
            icon: "user",
            type: "link",
            active: false,
            title: "User",
          },
          // {
          //   path: `/all-students`,
          //   icon: "user",
          //   type: "link",
          //   active: false,
          //   title: "Student Enquiry",
          // },
          {
            path: `/contact-enquiries`,
            icon: "message-square",
            type: "link",
            active: false,
            title: "Contact Enquiries",
          },
          {
            path: `/job-application-enquiries`,
            icon: "message-square",
            type: "link",
            active: false,
            title: "Job Application Enquiries",
          },
        ],
      },
    ],
  },
  {
    Items: [
      {
        title: "Localization",
        icon: "trending-up",
        type: "sub",
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}localization/fa`,
            active: false,
            title: "Persian",
            permission: "view",
            model: "Localization",
          },
          {
            path: `${import.meta.env.BASE_URL}localization/ar`,
            active: false,
            title: "Arabic",
            permission: "view",
            model: "Localization",
          },
          {
            path: `${import.meta.env.BASE_URL}localization/en`,
            active: false,
            title: "English",
            permission: "view",
            model: "Localization",
          },
        ],
      },
    ],
  },
  {
    Items: [
      {
        title: "Optometrist",
        icon: "settings",
        type: "sub",
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}optometrist/enquiry`,
            title: "All Optometrist Enquiries",
            type: "link",
            permission: "view",
            model: "Optometrist",
          },
          {
            path: `${import.meta.env.BASE_URL}optometrist/withdrawal-request`,
            title: "Withdrawal Requests",
            type: "link",
            permission: "view",
            model: "Optometrist",
          },
          {
            path: `${import.meta.env.BASE_URL}optometrist/memberships-plans`,
            title: "Memberships Plans",
            type: "link",
            permission: "view",
            model: "Optometrist",
          },
          // {
          //   path: `${import.meta.env.BASE_URL}optometrist/all-stores`,
          //   title: "All Stores",
          //   type: "link",
          //   permission: "view",
          //   model: "Optometrist",
          // },
          // {
          //   path: `${import.meta.env.BASE_URL}optometrist/appointment-list`,
          //   title: "Appointment Data",
          //   type: "link",
          //   permission: "view",
          //   model: "Optometrist",
          // },
        ],
      },
    ],
  },
  {
    Items: [
      {
        title: "Blogs",
        icon: "edit",
        type: "sub",
        active: false,
        children: [
          {
            path: `/all-posts`,
            icon: "book",
            type: "link",
            active: false,
            title: "All Posts",
          },
          {
            path: `/add-new-post`,
            icon: "plus-square",
            type: "link",
            active: false,
            title: "Add new post",
          },
          {
            path: `/all-blog-categories`,
            icon: "list",
            type: "link",
            active: false,
            title: "Categories",
          },
          {
            path: `/all-blog-tags`,
            icon: "tag",
            type: "link",
            active: false,
            title: "Tags",
          },
          // {
          //   path: `/all-comments`,
          //   icon: "message-circle",
          //   type: "link",
          //   active: false,
          //   title: "Comments",
          // },
        ],
      },
    ],
  },
  {
    Items: [
      {
        title: "Settings",
        icon: "settings",
        type: "sub",
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}setting/global-setting`,
            title: "Global Setting",
            type: "link",
            permission: "view",
            model: "Global",
          },
          {
            path: `${import.meta.env.BASE_URL}country-list`,
            title: "Countries",
            type: "link",
            permission: "view",
            model: "Country",
          },
          {
            path: `${import.meta.env.BASE_URL}currency-list`,
            title: "Currency",
            type: "link",
            permission: "view",
            model: "Currency",
          },
          {
            path: `${import.meta.env.BASE_URL}currency-exchange-rate-list`,
            title: "Currency Exchange Rate",
            type: "link",
            permission: "view",
            model: "CurrencyExchangeRate",
          },
        ],
      },
    ],
  },
  // {
  //   Items: [
  //     {
  //       title: "Support Desk",
  //       icon: "aperture",
  //       type: "sub",
  //       active: false,
  //       children: [
  //         {
  //           path: `/support-desk/notification`,
  //           title: "Email Notification",
  //           related_fields: [
  //             "/support-desk/notification-deleted-items",
  //             "/notification/edit-notification/:id",
  //             "/notification/add-notification"
  //           ],
  //           type: "link",
  //           permission: "view",
  //           model: 'Notification',
  //           // show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Notification.includes("view"))
  //         },
  //         {
  //           path: `/push-notification`,
  //           related_fields: [
  //             "/push-notification-deleted-items",
  //             "/push-notification/add-push-notification",
  //             "/push-notification/edit-push-notification/:id"
  //           ],
  //           title: "Push Notification",
  //           deletedPath: `/push-notification-deleted-items`,
  //           type: "link",
  //           permission: "view",
  //           model: 'PushNotification',
  //           // show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.PushNotification.includes("view"))
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    Items: [
      {
        title: "CMS",
        icon: "settings",
        type: "sub",
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}cms/faqs`,
            title: "Faq",
            type: "link",
            permission: "view",
            model: "Faqs",
          },
          {
            path: `${import.meta.env.BASE_URL}cms/home`,
            title: "Home",
            type: "link",
            permission: "view",
            model: "HomePage",
          },
          {
            path: `${import.meta.env.BASE_URL}cms/about-us-page`,
            title: "About Us",
            type: "link",
            permission: "view",
            model: "AboutUs",
          },
          {
            path: `${import.meta.env.BASE_URL}cms/career-page`,
            title: "Career Page",
            type: "link",
            permission: "view",
            model: "CareerPage",
          },
          {
            path: `${import.meta.env.BASE_URL}cms/contact-us`,
            title: "Contact Us",
            type: "link",
            permission: "view",
            model: "ContactUsPage",
          },
          {
            path: `/all-policies`,
            icon: "phone",
            title: "Policies",
            type: "link",
          },
          {
            path: `${import.meta.env.BASE_URL}cms/affiliate-page`,
            title: "Affiliate Page",
            type: "link",
            permission: "view",
            model: "AffiliatePage",
          },
          {
            path: `${import.meta.env.BASE_URL}cms/home-try-on-page`,
            title: "Home Try On Page",
            type: "link",
            permission: "view",
            model: "HomeTryOn",
          },
          {
            path: `${import.meta.env.BASE_URL}cms/job-positions`,
            title: "Job Position",
            type: "link",
            permission: "view",
            model: "JobOpening",
          },
          {
            path: `${import.meta.env.BASE_URL}optometrist/become-an-optometrist`,
            title: "Become an optometrist page content",
            type: "link",
            permission: "view",
            model: "Optometrist",
          },
          {
            path: `${import.meta.env.BASE_URL}optometrist-network`,
            title: "Optometrist Network page content",
            type: "link",
            permission: "view",
            model: "Optometrist",
          },
        ],
      },
    ],
  },
  {
    Items: [
      {
        path: `/media-list`,
        icon: "image",
        type: "link",
        active: false,
        title: "Media Uploaded",
        permission: "view",
        model: 'Media',
        // show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Media.includes("view"))
      },
    ],
  },
  {
    Items: [
      {
        title: "Roles & Permissions",
        icon: "lock",
        type: "sub",
        active: false,
        children: [
          {
            path: `/staff-permissions`,
            title: "Permissions",
            type: "link",
            active: false,
            permission: "view",
            model: "StaffLogin",
            related_fields: [
              "/staff-permissions/roles",
              "/staff-permissions/roles/add",
              "/staff-permissions/roles/edit/:id",
            ],
          },
          {
            path: `/staff-permissions/staff`,
            title: "Staff users",
            type: "link",
            active: false,
            permission: "view",
            model: "StaffLogin",
            related_fields: [
              "/staff-permissions/staff/add",
              "/staff-permissions/staff/view/:id",
              "/staff-permissions/staff/edit/:id",
            ],
          },
        ],
      },
    ],
  },
  {
    Items: [
      {
        path: `/staff-login`,
        icon: "database",
        viewPath: ``,
        type: "link",
        active: false,
        title: "Login Data",
        permission: "view",
        model: 'StaffLogin',
        // show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.StaffLogin.includes("view"))
      },
    ],
  },
];

const baseUrl = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

/** Side menu items shown only for role "Optometrist". Other roles use MENUITEMS. */
export const OPTometristMENUITEMS = [
  {
    menutitle: "MAIN",
    Items: [
      { title: "Overview", path: baseUrl ? `${baseUrl}/optometrist-dashboard/overview` : "/optometrist-dashboard/overview", icon: "home", type: "link", active: false, children: [] },
      { title: "Profile & Business", path: baseUrl ? `${baseUrl}/optometrist-dashboard/profile` : "/optometrist-dashboard/profile", icon: "user", type: "link", active: false, children: [] },
      { title: "Services", path: baseUrl ? `${baseUrl}/optometrist-dashboard/services` : "/optometrist-dashboard/services", icon: "briefcase", type: "link", active: false, children: [] },
      { title: "Working Rules", path: baseUrl ? `${baseUrl}/optometrist-dashboard/working-rules` : "/optometrist-dashboard/working-rules", icon: "clipboard", type: "link", active: false, children: [] },
      { title: "Availability", path: baseUrl ? `${baseUrl}/optometrist-dashboard/availability` : "/optometrist-dashboard/availability", icon: "calendar", type: "link", active: false, children: [] },
      { title: "Appointments", path: baseUrl ? `${baseUrl}/optometrist-dashboard/appointments` : "/optometrist-dashboard/appointments ", icon: "calendar", type: "link", active: false, children: [] },
      { title: "Customers & Prescriptions", path: baseUrl ? `${baseUrl}/optometrist-dashboard/customers` : "/optometrist-dashboard/customers", icon: "users", type: "link", active: false, children: [] },
      { title: "Wallet", path: baseUrl ? `${baseUrl}/optometrist-dashboard/wallet` : "/optometrist-dashboard/wallet", icon: "dollar-sign", type: "link", active: false, children: [] },
      { title: "Plan history", path: baseUrl ? `${baseUrl}/optometrist-dashboard/plan-history` : "/optometrist-dashboard/plan-history", icon: "file-text", type: "link", active: false, children: [] },
      { title: "Transactions", path: baseUrl ? `${baseUrl}/optometrist-dashboard/transactions` : "/optometrist-dashboard/transactions", icon: "list", type: "link", active: false, children: [] },
      { title: "Membership", path: baseUrl ? `${baseUrl}/optometrist-dashboard/memberships-plans` : "/optometrist-dashboard/memberships-plans", icon: "credit-card", type: "link", active: false, children: [] },
    ],
  },
];