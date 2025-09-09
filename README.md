create Admin dashboard for my monk lab website i want design for this purpose

1. in this you create first common component like
   - table component: in this also add pagination, sarching and shorting for common i share refrence for this. `import { icons } from "../../../utils/constants";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import "./Table.scss";
import { Spinner } from "react-bootstrap";
import LoaderCircle from "../LoaderCircle/LoaderCircle";

const Table = ({
  header,
  row,
  min,
  hidePagination,
  paginationOption,
  onPaginationChange,
  loader,
}) => {
  const handlePageChange = (selectedObject) => {
    onPaginationChange && onPaginationChange(selectedObject.selected);
    // Add your logic here to fetch new data based on the selected page.
  };
  return (
    <div id="table-container">
      <div className="table-body auri-scroll">
        <div className="header-row" style={{ minWidth: min || "1000px" }}>
          {header?.map((elm, index) => {
            const { title, className, isSort } = elm;
            return (
              <div
                className={`header-cell pointer ${className || ""}`}
                key={index}
              >
                <span>{title}</span>
                {isSort && (
                  <span className="h-12 w-12">
                    <img src={icons.sort} alt="sort" className="fit-image" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div
          className="body-container auri-scroll"
          style={{ minWidth: min || "1000px" }}
        >
          {!loader ? (
            row?.map((elm, index) => {
              return (
                <div className="body-row" key={index}>
                  {elm?.data?.map((cElem, cIndex) => {
                    return (
                      <div
                        className={`body-cell ${cElem?.className || ""}`}
                        key={cIndex}
                      >
                        {cElem?.value}
                      </div>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <div className="f-center py-50">
              <LoaderCircle size={100} />
            </div>
          )}
        </div>
      </div>
      {!hidePagination && (
        <div className="pagination-container">
          {paginationOption?.count === 0 ? (
            <div className="text-16-700">
              {loader ? "Please wait..." : "No records"}
            </div>
          ) : (
            <div className="text-14-500 color-757f">{`Showing ${
              paginationOption?.currentPage * paginationOption?.pageSize + 1
            }-${
              paginationOption?.count <
              (paginationOption?.currentPage + 1) * paginationOption?.pageSize
                ? paginationOption?.count
                : (paginationOption?.currentPage + 1) *
                  paginationOption?.pageSize
            } from ${paginationOption?.count}`}</div>
          )}

          <ReactPaginate
            pageCount={
              Math.ceil(paginationOption?.count / paginationOption?.pageSize) ||
              1
            }
            marginPagesDisplayed={1}
            pageRangeDisplayed={1}
            previousLabel={<div className="prev-btn">Prev</div>}
            nextLabel={<div className="next-btn">Next</div>}
            breakLabel="..."
            activeClassName={"selected"}
            onPageChange={handlePageChange}
            forcePage={paginationOption?.currentPage || 0}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
`
   - input component: in this i want sepret input field like input,selection,checkbox
   - other component: also add other common component like card, button, popup model, extra...
2. how to design dashboard? i explain.

   - create first comman header in this also handle badcrumb,profile menu,logout, extra. and also i want saidebar for menu. all menu releted in admin than its in saidebar. than menu waise component render in dashboard box also i want design some menu in this

     \*PRODUCT: i have create product menu and api so i want to create some flow for this menu. in this add firstly add product from. releted form data like name -> text, decs -> textariya, defaultVariant -> selection, category -> multiple selection, image -> in this upload and also preview in right said on upload filed and also upload single image, price -> number, discount -> number, tag -> multiple selection. now first stap add profile data is complited now this data show in table in /product route and also handle add route. than now next stape is add variyent images in product than how can i genret flow you can handle it in this i have there variyent like ["vertical", "horizontal", "square"] so i want add images up to 6 and also preview in upload field i want upload design like add multiple profile photos like tender or other app profile mangemant. in this i share my model code `// src/modules/product/model.js
import mongoose from "mongoose";
import { modelName } from "../../utils/helper.js";

// Subdoc for one image inside a variant
const variantImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, default: "" },
    // optional extras if storing CDN info
    width: { type: Number },
    height: { type: Number },
    format: { type: String }, // e.g., "jpeg","png","webp"
    sortOrder: { type: Number, default: 0 }, // for manual ordering if needed
  },
  { _id: true, timestamps: false }
);

// Subdoc for a variant gallery
const gallerySchema = new mongoose.Schema(
  {
    images: { type: [variantImageSchema], default: [] },
    // 0-based index into images; clamp in controllers when images mutate
    primaryIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false, timestamps: false }
);

// Main product schema
const productSchema = new mongoose.Schema(
  {
    skuId: { type: String, unique: true, index: true, required: true },
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },

    // Fixed variants: vertical, horizontal, square
    variants: {
      type: new mongoose.Schema(
        {
          vertical: { type: gallerySchema, default: () => ({}) },
          horizontal: { type: gallerySchema, default: () => ({}) },
          square: { type: gallerySchema, default: () => ({}) },
        },
        { _id: false }
      ),
      required: true,
      default: () => ({}),
    },

    // Optional default variant for storefront fallback
    defaultVariant: {
      type: String,
      enum: ["vertical", "horizontal", "square"],
      default: "vertical",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelName.CATEGORY,
      required: true,
      index: true,
    },

    image: { type: variantImageSchema, default: {} }, // generic images not tied to variants

    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },

    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: modelName.TAG }],

    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelName.USER,
      required: true,
    },
  },
  { timestamps: true }
);

// Optional safety: clamp primaryIndex on save
productSchema.pre("save", function (next) {
  const clamp = (g) => {
    if (!g || !Array.isArray(g.images)) return;
    if (g.images.length === 0) g.primaryIndex = 0;
    else if (g.primaryIndex >= g.images.length)
      g.primaryIndex = g.images.length - 1;
    else if (g.primaryIndex < 0) g.primaryIndex = 0;
  };
  clamp(this.variants?.vertical);
  clamp(this.variants?.horizontal);
  clamp(this.variants?.square);
  next();
});

export default mongoose.model("products", productSchema);
`

     \*CATEGORY: in this normally add,edit,delete and view. also i share model `// src/modules/category/model.js
import mongoose from "mongoose";
import { modelName } from "../../utils/helper.js";

const categorySchema = new mongoose.Schema(
  {
    // Human-readable unique name (e.g., "Wall Art")
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
      unique: true,
      index: true,
    },

    // Short description for admins/SEO snippets
    desc: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    // URL-friendly slug generated from name (unique)
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    bannerUrl: { type: String, default: "" },

    sortOrder: { type: Number, default: 0 },

    // Soft flags
    isActive: { type: Boolean, default: true }, // hide from storefront if false
    isDeleted: { type: Boolean, default: false }, // keep for history without hard delete

    // Auditing (optional; fill in controllers/middleware if you track users)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelName.CATEGORY,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelName.CATEGORY,
    },
  },
  { timestamps: true }
);

// Simple slugify helper
function toSlug(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Ensure slug exists/updates when name changes
categorySchema.pre("validate", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = toSlug(this.name);
  }
  next();
});

export default mongoose.model("categories", categorySchema);
`

     \*TAG: in this normally add,edit,delete and view. also i share model `// src/modules/category/model.js
import mongoose from "mongoose";
import { modelName } from "../../utils/helper.js";

const tagSchema = new mongoose.Schema(
    {
        // Human-readable unique name (e.g., "Wall Art")
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 80,
            unique: true,
            index: true,
        },

        // Short description for admins/SEO snippets
        desc: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },
        value: {
            type: String,
            trim: true,
            default: ""
        },

        // Soft flags
        isActive: { type: Boolean, default: true }, // hide from storefront if false
        isDeleted: { type: Boolean, default: false }, // keep for history without hard delete

        // Auditing (optional; fill in controllers/middleware if you track users)
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: modelName.TAG },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: modelName.TAG },
    },
    { timestamps: true }
);

export default mongoose.model("tags", tagSchema);
`

   - LOGIN:- in admin dashboard i want only login forms

   - NOTE:-
     *forms: in this use formik and yup for forms build
     *table: i want common table. and also in this i want shorting, pagination, filter

3. i want in all things in react with jsx and also use common theme for this dashboard. i wan only design. and also check it any unused common commpoent not created in ptoject i want net and cline strucher 
