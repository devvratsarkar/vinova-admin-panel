import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";

const EditVariant = lazy(() => import("../../components/inventory-with-variant/EditVariant"));
const ListVariantEditPopup = lazy(() => import("../../components/inventory-with-variant/ListVariantEditPopup"));
const ApproveCancellation = lazy(() => import("../../components/cancellation/ApproveCancellation"));
const DeclineCancellation = lazy(() => import("../../components/cancellation/DeclineCancellation"));
const BrandRestore = lazy(() => import("../../components/brand/BrandRestore"));
const DeleteBrand = lazy(() => import("../../components/brand/DeleteBrand"));
const DeleteCategory = lazy(() => import("../../components/catalogue/category/DeleteCategory"));
const CategoryRestore = lazy(() => import("../../components/catalogue/category/CategoryRestore"));
const AddCustomField = lazy(() => import("../../components/catalogue/customfield/AddCustomField"));
const EditCustomField = lazy(() => import("../../components/catalogue/customfield/EditCustumField"));
const DeleteField = lazy(() => import("../../components/catalogue/customfield/DeleteField"));
const CustomFieldRestore = lazy(() => import("../../components/catalogue/customfield/CustomFieldRestore"));
const AddCustumFieldValue = lazy(() => import("../../components/catalogue/customfield/AddCustumFieldValue"));
const ViewCustumFieldValue = lazy(() => import("../../components/catalogue/customfield/ViewCustumFieldValue"));
const EditCustumFieldValue = lazy(() => import("../../components/catalogue/customfield/EditCustumFieldValue"));
const DeleteFieldValue = lazy(() => import("../../components/catalogue/customfield/DeleteFieldValue"));
const CustomFieldValueRestore = lazy(() => import("../../components/catalogue/customfield/CustomFieldValueRestore"));
const FeaturedImgModal = lazy(() => import("../../commondata/delete_modal/FeaturedImgModal"));
const AddTrashVariant = lazy(() => import("../../components/inventory-with-variant/AddTrashVarient"));
const RestoreInventoryWithVariant = lazy(() => import("../../components/inventory-with-variant/RestoreInventoryWithVariant"));
const AddVariant = lazy(() => import("../../components/inventory-with-variant/AddVariant"));
const UpdateProfile = lazy(() => import("../../components/user-profile/updateProfile"));
const ChangePassword = lazy(() => import("../../components/user-profile/ChangePassword"));
const ImagePreview = lazy(() => import("../../commondata/ImagePreview"));
const DeleteFrame = lazy(() => import("../../components/frames/DeleteFrame"));
const FrameRestore = lazy(() => import("../../components/frames/FrameRestore"));
const RestoreLens = lazy(() => import("../../components/lens/RestoreLens"));
const DeleteLens = lazy(() => import("../../components/lens/DeleteLens"));
const DeleteFilter = lazy(() => import("../../components/filter/DeleteFilter"));
const RestoreFilter = lazy(() => import("../../components/filter/RestoreFilter"));
const DeleteLensThickness = lazy(() => import("../../components/lens-thickness/DeleteLensThickness"));
const RestoreLensThickness = lazy(() => import("../../components/lens-thickness/RestoreLensThickness"));
const RestoreLensColor = lazy(() => import("../../components/lens-color/RestoreLensColor"));
const DeleteLensColor = lazy(() => import("../../components/lens-color/DeleteLensColor"));
const DeleteContactLensType = lazy(() => import("../../components/contact-lens-type/DeleteContactLensType"));
const DeleteMaterial = lazy(() => import("../../components/material/DeleteMaterial"));
const RestoreQuestion = lazy(() => import("../../components/questions/RestoreQuestion"));
const DeleteQuestion = lazy(() => import("../../components/questions/DeleteQuestion"));
const SelectState = lazy(() => import("../../components/shipping/shipping-zone/SelectStates"));
const AddZone = lazy(() => import("../../components/shipping/shipping-zone/AddZone"));
const AddRate = lazy(() => import("../../components/shipping/shipping-zone/AddRate"));
const EditZone = lazy(() => import("../../components/shipping/shipping-zone/EditZone"));
const EditRate = lazy(() => import("../../components/shipping/shipping-zone/EditRate"));
const DeleteZoneModal = lazy(() => import("../../components/shipping/shipping-zone/DeleteZoneModal"));
const DeleteCarrier = lazy(() => import("../../components/shipping/carrier/DeleteCarrier"));
const RestoreCarrier = lazy(() => import("../../components/shipping/carrier/RestoreCarrier"));
const DeleteCurrency = lazy(() => import("../../components/currency/DeleteCurrency"));
const RestoreCurrency = lazy(() => import("../../components/currency/RestoreCurrency"));
const ViewCart = lazy(() => import("../../components/cart/ViewCart"));
const RestoreCoupon = lazy(() => import("../../components/coupon/RestoreCoupon"));
const DeleteCoupon = lazy(() => import("../../components/coupon/DeleteCoupon"));
const DeleteJobPosition = lazy(() => import("../../components/job-position/DeleteJobPosition"));
const RestoreJobPosition = lazy(() => import("../../components/job-position/ResoreJobPosition"));
const TransectionDetails = lazy(() => import("../../components/affiliate/withdrawal/TransectionDetails"));
const CouponDetails = lazy(() => import("../../components/affiliate/coupon/CouponDetails"));
const DeteteContactLens = lazy(() => import("../../components/contact-lens/DeteteContactLens"));
const RestoreContactLense = lazy(() => import("../../components/contact-lens/RestoreContactLense"));
const DeleteAccessroies = lazy(() => import("../../components/accessories/DeleteAccessroies"));
const RestoreAccessories = lazy(() => import("../../components/accessories/RestoreAccessories"));
const DeleteOptometristStore = lazy(() => import("../../components/optometrist/DeleteOptometristStore"));
const RestoreOptometristStore = lazy(() => import("../../components/optometrist/RestoreOptometristStore"));
const EditOptometristEnquiryModal = lazy(() => import("../../components/optometrist/optometrist-enquiry/EditOptometristEnquiryModal"));
const RegisterOptometristModal = lazy(() => import("../../components/optometrist/optometrist-enquiry/RegisterOptometristModal"));
const EditMembershipPlanModal = lazy(() => import("../../components/optometrist/membership/EditMembershipPlanModal"));
const DeleteMembershipPlan = lazy(() => import("../../components/optometrist/membership/DeleteMembershipPlan"));
const RestoreMembershipPlan = lazy(() => import("../../components/optometrist/membership/RestoreMembershipPlan"));
const DeleteInventoryWithoutVariant = lazy(() => import("../../components/stocks/inventory-without-variant/DeleteInventoryWithoutVariant"));
const RestoreInventoryWithoutVariant = lazy(() => import("../../components/stocks/inventory-without-variant/RestoreInventoryWithoutVariant"));
const ViewCustomer = lazy(() => import("../../components/customer-data/customer/ViewCustomer"));
const ChangeUserPassword = lazy(() => import("../../components/customer-data/customer/ChangeUserPassword"));
const RemoveWishlist = lazy(() => import("../../components/wishlist/RemoveWishlist"));
const ViewWishlist = lazy(() => import("../../components/wishlist/VIewWishlist"));
const DeletePolicy = lazy(() => import("../../components/cms/policy-pages/DeletePolicy"));
const ReplyDisputeMessage = lazy(() => import("../../components/dispute/editDisputeDetail"));
const AddMedia = lazy(() => import("../../components/media/AddMedia"));
const ViewMedia = lazy(() => import("../../components/media/ViewMedia"));
const DeleteMedia = lazy(() => import("../../components/media/DeleteMedia"));
const DeleteNotifiation = lazy(() => import("../../components/support desk/notification/DeleteNotifiation"));
const RestoreNotification = lazy(() => import("../../components/support desk/notification/RestoreNotification"));
const DeletedPushNotification = lazy(() => import("../../components/support desk/push-notification/DeletedPushNotification"));
const RestorePushNotification = lazy(() => import("../../components/support desk/push-notification/RestorePushNotification"));
const DeleteFaqs = lazy(() => import("../../components/faq/DeleteFaqs"));
const DeletePost = lazy(() => import("../../components/blogs/DeletePost"));
const RestorePost = lazy(() => import("../../components/blogs/RestorePost"));
const BulkDelete = lazy(() => import("../../components/blogs/BulkDelete"));
const DeleteBlogCategory = lazy(() => import("../../components/blogs/categories/DeleteBlogCategory"));
const RestoreBlogCategory = lazy(() => import("../../components/blogs/categories/RestoreBlogCategory"));
const EditBlogTags = lazy(() => import("../../components/blogs/tags/EditBlogTags"));
const ViewBlogTag = lazy(() => import("../../components/blogs/tags/ViewBlogTag"));
const AddBlogTags = lazy(() => import("../../components/blogs/tags/AddBlogTags"));
const BlogTagsDelete = lazy(() => import("../../components/blogs/tags/BlogTagsDelete"));
const RestoreBlogTags = lazy(() => import("../../components/blogs/tags/RestoreBlogTags"));
const DeleteComment = lazy(() => import("../../components/blogs/comments/DeleteComment"));
const ViewReviewModal = lazy(() => import("../../components/reviews/ViewReviewModal"));
const EditStaff = lazy(() => import("../../components/staff-permissions/EditStaff"));
const DeleteStaff = lazy(() => import("../../components/staff-permissions/DeleteStaff"));

export default function Modal() {
    const { isOpen, componentName } = useSelector(
        (state) => state.allCommonModal
    );

    const renderComponent = () => {
        switch (componentName) {

            case "BrandRestore":
                return <BrandRestore />;
            case "DeleteBrand":
                return <DeleteBrand />;

            case "EditVariant":
                return <EditVariant />;
            case "ListVariantEditPopup":
                return <ListVariantEditPopup />;

            case "DeclineCancellation":
                return <DeclineCancellation />;

            case "DeleteCategory":
                return <DeleteCategory />;
            case "CategoryRestore":
                return <CategoryRestore />;

            case "AddCustomField":
                return <AddCustomField />;
            case "EditCustomField":
                return <EditCustomField />;
            case "DeleteField":
                return <DeleteField />;
            case "CustomFieldRestore":
                return <CustomFieldRestore />;
            case "AddCustumFieldValue":
                return <AddCustumFieldValue />;
            case "ViewCustumFieldValue":
                return <ViewCustumFieldValue />;
            case "EditCustumFieldValue":
                return <EditCustumFieldValue />;
            case "DeleteFieldValue":
                return <DeleteFieldValue />;
            case "CustomFieldValueRestore":
                return <CustomFieldValueRestore />;

            case "FeaturedImgModal":
                return <FeaturedImgModal />;

            case "AddTrashVariant":
                return <AddTrashVariant />
            case "RestoreInventoryWithVariant":
                return <RestoreInventoryWithVariant />
            case "AddVariant":
                return <AddVariant />

            case "updateProfile":
                return <UpdateProfile />
            case "ChangePassword":
                return <ChangePassword />
            case "ImagePreview":
                return <ImagePreview />
            case "DeleteFrame":
                return <DeleteFrame />
            case "FrameRestore":
                return <FrameRestore />
            case "RestoreLens":
                return <RestoreLens />
            case "DeleteLens":
                return <DeleteLens />
            case "DeleteFilter":
                return <DeleteFilter />
            case "RestoreFilter":
                return <RestoreFilter />

            case "DeleteLensThickness":
                return <DeleteLensThickness />
            case "RestoreLensThickness":
                return <RestoreLensThickness />

            //lens color
            case "RestoreLensColor":
                return <RestoreLensColor />;
            case "DeleteLensColor":
                return <DeleteLensColor />;

            //contact lens type
            case "DeleteContactLensType":
                return <DeleteContactLensType />;

            case "DeleteMaterial":
                return <DeleteMaterial />;

            //question
            case "RestoreQuestion":
                return <RestoreQuestion />;
            case "DeleteQuestion":
                return <DeleteQuestion />;


            //shiiping and career
            case "SelectStates":
                return <SelectState />;
            case "AddZone":
                return <AddZone />;
            case "AddRate":
                return <AddRate />;
            case "EditZone":
                return <EditZone />;
            case "EditRate":
                return <EditRate />;
            case "DeleteZoneModal":
                return <DeleteZoneModal />;
            case "DeleteCarrier":
                return <DeleteCarrier />;
            case "RestoreCarrier":
                return <RestoreCarrier />;

            //currency
            case "DeleteCurrency":
                return <DeleteCurrency />;
            case "RestoreCurrency":
                return <RestoreCurrency />;

            //cart
            case "ViewCart":
                return <ViewCart />;

            //coupon
            case "DeleteCoupon":
                return <DeleteCoupon />
            case "RestoreCoupon":
                return <RestoreCoupon />

            //job position
            case "RestoreJobPosition":
                return <RestoreJobPosition />
            case "DeleteJobPosition":
                return <DeleteJobPosition />
            case "TransectionDetails":
                return <TransectionDetails />
            case "CouponDetails":
                return <CouponDetails />
            case "DeteteContactLens":
                return <DeteteContactLens />
            case "RestoreContactLense":
                return <RestoreContactLense />
            case "DeleteAccessroies":
                return <DeleteAccessroies />
            case "RestoreAccessories":
                return <RestoreAccessories />
            case "DeleteOptometristStore":
                return <DeleteOptometristStore />
            case "RestoreOptometristStore":
                return <RestoreOptometristStore />
            case "EditOptometristEnquiry":
                return <EditOptometristEnquiryModal />
            case "RegisterOptometrist":
                return <RegisterOptometristModal />
            case "AddMembershipPlan":
            case "EditMembershipPlan":
                return <EditMembershipPlanModal />
            case "DeleteMembershipPlan":
                return <DeleteMembershipPlan />
            case "RestoreMembershipPlan":
                return <RestoreMembershipPlan />
            case "DeleteInventoryWithoutVariant":
                return <DeleteInventoryWithoutVariant />
            case "RestoreInventoryWithoutVariant":
                return <RestoreInventoryWithoutVariant />
            case "ViewCustomer":
                return <ViewCustomer />
            case "ChangeUserPassword":
                return <ChangeUserPassword />
            case "RemoveWishlist":
                return <RemoveWishlist />
            case "ViewWishlist":
                return <ViewWishlist />
            case "DeletePolicy":
                return <DeletePolicy />
            case "ReplyDisputeMessage":
                return <ReplyDisputeMessage />
            case "AddMedia":
                return <AddMedia />
            case "ViewMedia":
                return <ViewMedia />
            case "DeleteMedia":
                return <DeleteMedia />
            case "DeleteNotifiation":
                return <DeleteNotifiation />
            case "RestoreNotification":
                return <RestoreNotification />
            case "DeletedPushNotification":
                return <DeletedPushNotification />
            case "RestorePushNotification":
                return <RestorePushNotification />
            case "DeleteFaqs":
                return <DeleteFaqs />

            case "DeletePost":
                return <DeletePost />
            case "RestorePost":
                return <RestorePost />
            case "BulkDelete":
                return <BulkDelete />
            case "DeleteBlogCategory":
                return <DeleteBlogCategory />
            case "RestoreBlogCategory":
                return <RestoreBlogCategory />
            case "EditBlogTags":
                return <EditBlogTags />
            case "ViewBlogTag":
                return <ViewBlogTag />
            case "AddBlogTags":
                return <AddBlogTags />
            case "BlogTagsDelete":
                return <BlogTagsDelete />
            case "RestoreBlogTags":
                return <RestoreBlogTags />
            case "DeleteComment":
                return <DeleteComment />
            case "ViewReview":
                return <ViewReviewModal />
            case "EditStaff":
                return <EditStaff />
            case "DeleteStaff":
                return <DeleteStaff />

            default:
                return null;
        }
    };
    return (
        <Suspense fallback={null}>
            {isOpen && renderComponent()}
        </Suspense>
    );
}