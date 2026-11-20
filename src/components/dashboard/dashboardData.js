const MILLION = 1_000_000

const yearEarningsM = [1382, 1462, 1592, 1542, 1702, 1822, 1762, 1892, 1842, 2002, 1420.65]
const yearOrders = [910, 970, 1050, 1000, 1130, 1210, 1170, 1270, 1230, 1350, 1190]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']

function spacedDayLabels(count, spanDays) {
  const labels = []
  const step = spanDays / (count - 1)
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - Math.round(i * step))
    labels.push(date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))
  }
  return labels
}

function weekdayLabels(count) {
  const labels = []
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    labels.push(date.toLocaleDateString('en-GB', { weekday: 'short' }))
  }
  return labels
}

export const PERIODS = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'year', label: 'This Year' },
  { id: 'custom', label: 'Custom' },
]

const PERIOD_KEY = {
  week: '7d',
  month: '30d',
  year: 'year',
}

const RANGE_LABEL = {
  week: 'This week',
  month: 'This month',
}

const recentOrders = [
  { id: 'VN-10482', customer: 'Maryam Rezaei', city: 'Tehran', amount: 833344200, when: '12 Nov', payment: 'Unpaid', status: 'Pending' },
  { id: 'VN-10471', customer: 'Omar Al Hashimi', city: 'Dubai', amount: 1860, currency: 'AED', when: '12 Nov', payment: 'Paid', status: 'Processing' },
  { id: 'VN-10466', customer: 'James Whitaker', city: 'London', amount: 248, currency: 'GBP', when: '11 Nov', payment: 'Paid', status: 'Dispatched' },
  { id: 'VN-10458', customer: 'Niloofar Karimi', city: 'Isfahan', amount: 246500000, when: '11 Nov', payment: 'Paid', status: 'Delivered' },
  { id: 'VN-10441', customer: 'Reza Moradi', city: 'Shiraz', amount: 53149500, when: '10 Nov', payment: 'Paid', status: 'Delivered' },
  { id: 'VN-10433', customer: 'Leila Hosseini', city: 'Tabriz', amount: 118200000, when: '10 Nov', payment: 'Unpaid', status: 'Cancelled' },
  { id: 'VN-10420', customer: 'Sara Nazari', city: 'Mashhad', amount: 96400000, when: '09 Nov', payment: 'Paid', status: 'Delivered' },
]

const affiliates = [
  { name: 'Parisa Nouri', city: 'Tehran', uses: 92, discount: 28_400_000, commission: 32_600_000 },
  { name: 'Hassan Al Maktoum', city: 'Dubai', uses: 74, discount: 21_200_000, commission: 24_800_000 },
  { name: 'Emily Clarke', city: 'London', uses: 61, discount: 16_400_000, commission: 18_900_000 },
  { name: 'Kian Farhadi', city: 'Isfahan', uses: 48, discount: 12_100_000, commission: 14_200_000 },
  { name: 'Yasmin Hosseini', city: 'Shiraz', uses: 36, discount: 9_400_000, commission: 11_600_000 },
]

const optometrists = [
  { name: 'Dr. Sara Ahmadi', city: 'Tehran', appointments: 186, revenue: 920000000, rating: 4.9 },
  { name: 'Dr. Reza Karimi', city: 'Isfahan', appointments: 154, revenue: 764000000, rating: 4.8 },
  { name: 'Dr. Niloofar Hosseini', city: 'Shiraz', appointments: 141, revenue: 688000000, rating: 4.8 },
  { name: 'Dr. Amir Nazari', city: 'Mashhad', appointments: 128, revenue: 602000000, rating: 4.7 },
  { name: 'Dr. Leila Moradi', city: 'Tabriz', appointments: 117, revenue: 541000000, rating: 4.6 },
]

const products = [
  { name: 'Titanium Aviator', category: 'Frames', units: 842, revenue: 2104000000, share: 86 },
  { name: 'Progressive clear lens', category: 'Lenses', units: 1264, revenue: 1688000000, share: 69 },
  { name: 'Daily lenses, 30 pack', category: 'Contact lenses', units: 980, revenue: 1126000000, share: 46 },
  { name: 'Polarized sport frame', category: 'Frames', units: 416, revenue: 864000000, share: 35 },
  { name: 'Slim case and cloth set', category: 'Accessories', units: 1540, revenue: 286000000, share: 14 },
]

const catalogue = [
  { name: 'Frames', share: 42, amount: 6800000000 },
  { name: 'Contact lenses', share: 16, amount: 2590000000 },
  { name: 'Accessories', share: 9, amount: 1458000000 },
  { name: 'Home try-on', share: 6, amount: 970200000 },
]

const storefronts = [
  { code: 'IR', name: 'Iran', flag: 'https://flagcdn.com/w40/ir.png', share: 72, amount: 13262000000, orders: 9020 },
  { code: 'AE', name: 'UAE', flag: 'https://flagcdn.com/w40/ae.png', share: 18, amount: 3316000000, orders: 2140 },
  { code: 'GB', name: 'UK', flag: 'https://flagcdn.com/w40/gb.png', share: 10, amount: 1840000000, orders: 1320 },
]

export const snapshots = {
  year: {
    range: 'Jan – Nov 2026',
    earnings: 18_420_650_000,
    earningsTrend: '+12.4%',
    sales: 16_184_020_000,
    platformFee: 1_750_630_000,
    salesTrend: '+8.1%',
    orders: 12480,
    ordersTrend: '+6.2%',
    ordersHint: '860 still open · 120 home try-on',
    aov: 1_296_800,
    aovTrend: '+3.4%',
    customers: 8420,
    customersTrend: '+9.6%',
    totalCustomers: 18420,
    newCustomers: 1260,
    returning: 38,
    openCarts: 486,
    wishlists: 1294,
    contactEnquiries: 34,
    jobApplications: 8,
    reviews: 2140,
    reviewsPending: 23,
    htoOrders: 120,
    rejectedOrders: 64,
    holdOrders: 28,
    refunds: 312_400_000,
    refundCount: 214,
    withdrawalCount: 42,
    optometristCommission: 864_000_000,
    coupons: 86,
    activeCoupons: 54,
    couponsUsed: 3180,
    couponDiscount: 642_000_000,
    discountCount: 4860,
    optometristDiscount: 286_000_000,
    optometristDiscountUses: 980,
    affiliateDiscount: 164_000_000,
    affiliateDiscountUses: 700,
    revenue: 16_826_020_000,
    frames: 248,
    contactLenses: 96,
    accessories: 74,
    optometrists: 186,
    optometristTrend: '+14 new',
    activeOptometrists: 164,
    pendingOptometrists: 11,
    appointments: 3184,
    membership: 486_000_000,
    fulfillment: 91,
    status: [
      { label: 'Delivered', value: 10240, tone: 'delivered' },
      { label: 'Processing', value: 1040, tone: 'processing' },
      { label: 'Pending', value: 860, tone: 'pending' },
      { label: 'Cancelled', value: 340, tone: 'cancelled' },
    ],
    affiliates: 64,
    affiliateCommission: 214_000_000,
    couponRequests: 9,
    attention: { applications: 11, disputes: 18, unpaid: 420, lowStock: 7, withdrawals: 126_400_000 },
    labels: months,
    earningsSeries: yearEarningsM.map((value) => Math.round(value * MILLION)),
    ordersSeries: yearOrders,
  },
  '30d': {
    range: 'Last 30 days',
    earnings: 1_642_000_000,
    earningsTrend: '+4.8%',
    sales: 1_438_000_000,
    platformFee: 162_000_000,
    salesTrend: '+3.2%',
    orders: 1086,
    ordersTrend: '+2.4%',
    ordersHint: '96 still open · 18 home try-on',
    aov: 1_324_000,
    aovTrend: '+1.1%',
    customers: 640,
    customersTrend: '+5.4%',
    totalCustomers: 18420,
    newCustomers: 188,
    returning: 41,
    openCarts: 486,
    wishlists: 1294,
    contactEnquiries: 34,
    jobApplications: 8,
    reviews: 186,
    reviewsPending: 23,
    htoOrders: 18,
    rejectedOrders: 8,
    holdOrders: 4,
    refunds: 28_600_000,
    refundCount: 19,
    withdrawalCount: 8,
    optometristCommission: 78_000_000,
    coupons: 86,
    activeCoupons: 54,
    couponsUsed: 286,
    couponDiscount: 58_000_000,
    discountCount: 420,
    optometristDiscount: 24_000_000,
    optometristDiscountUses: 78,
    affiliateDiscount: 12_400_000,
    affiliateDiscountUses: 56,
    revenue: 1_496_000_000,
    frames: 248,
    contactLenses: 96,
    accessories: 74,
    optometrists: 186,
    optometristTrend: '+8 new',
    activeOptometrists: 164,
    pendingOptometrists: 11,
    appointments: 286,
    membership: 42_000_000,
    fulfillment: 89,
    status: [
      { label: 'Delivered', value: 820, tone: 'delivered' },
      { label: 'Processing', value: 140, tone: 'processing' },
      { label: 'Pending', value: 96, tone: 'pending' },
      { label: 'Cancelled', value: 30, tone: 'cancelled' },
    ],
    affiliates: 64,
    affiliateCommission: 18_600_000,
    couponRequests: 4,
    attention: { applications: 11, disputes: 6, unpaid: 54, lowStock: 7, withdrawals: 18_200_000 },
    labels: spacedDayLabels(6, 30),
    earningsSeries: [220, 248, 266, 254, 312, 342].map((value) => value * MILLION),
    ordersSeries: [142, 168, 174, 166, 208, 228],
  },
  '7d': {
    range: 'Last 7 days',
    earnings: 386_400_000,
    earningsTrend: '+6.1%',
    sales: 341_200_000,
    platformFee: 35_600_000,
    salesTrend: '+4.4%',
    orders: 248,
    ordersTrend: '+3.8%',
    ordersHint: '22 still open · 6 home try-on',
    aov: 1_376_000,
    aovTrend: '+2.0%',
    customers: 176,
    customersTrend: '+7.2%',
    totalCustomers: 18420,
    newCustomers: 48,
    returning: 36,
    openCarts: 486,
    wishlists: 1294,
    contactEnquiries: 34,
    jobApplications: 8,
    reviews: 42,
    reviewsPending: 23,
    htoOrders: 6,
    rejectedOrders: 3,
    holdOrders: 1,
    refunds: 6_800_000,
    refundCount: 5,
    withdrawalCount: 3,
    optometristCommission: 18_400_000,
    coupons: 86,
    activeCoupons: 54,
    couponsUsed: 64,
    couponDiscount: 14_200_000,
    discountCount: 96,
    optometristDiscount: 5_600_000,
    optometristDiscountUses: 18,
    affiliateDiscount: 2_800_000,
    affiliateDiscountUses: 14,
    revenue: 355_400_000,
    frames: 248,
    contactLenses: 96,
    accessories: 74,
    optometrists: 186,
    optometristTrend: '+3 new',
    activeOptometrists: 164,
    pendingOptometrists: 11,
    appointments: 74,
    membership: 9_600_000,
    fulfillment: 87,
    status: [
      { label: 'Delivered', value: 168, tone: 'delivered' },
      { label: 'Processing', value: 42, tone: 'processing' },
      { label: 'Pending', value: 22, tone: 'pending' },
      { label: 'Cancelled', value: 16, tone: 'cancelled' },
    ],
    affiliates: 64,
    affiliateCommission: 4_200_000,
    couponRequests: 2,
    attention: { applications: 11, disputes: 3, unpaid: 14, lowStock: 7, withdrawals: 4_800_000 },
    labels: weekdayLabels(7),
    earningsSeries: [42, 48, 51, 46, 62, 71, 66.4].map((value) => value * MILLION),
    ordersSeries: [28, 32, 34, 30, 40, 44, 40],
  },
  today: {
    range: 'Today',
    earnings: 54_800_000,
    earningsTrend: '+9.2%',
    sales: 48_200_000,
    platformFee: 5_400_000,
    salesTrend: '+5.6%',
    orders: 36,
    ordersTrend: '+4',
    ordersHint: '8 still open · 2 home try-on',
    aov: 1_339_000,
    aovTrend: '+1.8%',
    customers: 31,
    customersTrend: '+6',
    totalCustomers: 18420,
    newCustomers: 9,
    returning: 29,
    openCarts: 486,
    wishlists: 1294,
    contactEnquiries: 34,
    jobApplications: 8,
    reviews: 6,
    reviewsPending: 23,
    htoOrders: 2,
    rejectedOrders: 1,
    holdOrders: 0,
    refunds: 1_400_000,
    refundCount: 1,
    withdrawalCount: 1,
    optometristCommission: 2_600_000,
    coupons: 86,
    activeCoupons: 54,
    couponsUsed: 9,
    couponDiscount: 2_100_000,
    discountCount: 14,
    optometristDiscount: 860_000,
    optometristDiscountUses: 3,
    affiliateDiscount: 420_000,
    affiliateDiscountUses: 2,
    revenue: 50_300_000,
    frames: 248,
    contactLenses: 96,
    accessories: 74,
    optometrists: 186,
    optometristTrend: '+1 new',
    activeOptometrists: 164,
    pendingOptometrists: 11,
    appointments: 12,
    membership: 1_200_000,
    fulfillment: 78,
    status: [
      { label: 'Delivered', value: 14, tone: 'delivered' },
      { label: 'Processing', value: 10, tone: 'processing' },
      { label: 'Pending', value: 8, tone: 'pending' },
      { label: 'Cancelled', value: 4, tone: 'cancelled' },
    ],
    affiliates: 64,
    affiliateCommission: 640_000,
    couponRequests: 1,
    attention: { applications: 11, disputes: 2, unpaid: 5, lowStock: 7, withdrawals: 1_400_000 },
    labels: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'],
    earningsSeries: [6.2, 8.4, 11.1, 9.6, 10.8, 8.7].map((value) => value * MILLION),
    ordersSeries: [4, 6, 8, 6, 7, 5],
  },
}

const PERIOD_SCALE = {
  year: 1,
  '30d': 1_642_000_000 / 18_420_650_000,
  '7d': 386_400_000 / 18_420_650_000,
  today: 54_800_000 / 18_420_650_000,
}

function parseISODate(value) {
  const [year, month, day] = String(value || '').split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function inclusiveDays(from, to) {
  const start = parseISODate(from)
  const end = parseISODate(to)
  if (!start || !end || end < start) return 0
  return Math.round((end - start) / 86400000) + 1
}

function formatRange(from, to) {
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  const start = parseISODate(from).toLocaleDateString('en-GB', options)
  const end = parseISODate(to).toLocaleDateString('en-GB', options)
  return `${start} – ${end}`
}

function customSeries(from, to, total, points) {
  const start = parseISODate(from)
  const end = parseISODate(to)
  const count = Math.min(8, Math.max(4, points))
  const wave = []
  const labels = []
  for (let index = 0; index < count; index += 1) {
    const progress = count === 1 ? 0 : index / (count - 1)
    const date = new Date(start.getTime() + (end - start) * progress)
    labels.push(date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))
    wave.push(0.72 + 0.28 * Math.sin(index * 1.15) + progress * 0.18)
  }
  const sum = wave.reduce((totalWave, value) => totalWave + value, 0)
  return {
    labels,
    series: wave.map((value) => Math.max(1, Math.round((value / sum) * total))),
  }
}

function scaleSnapshot(snapshot, scale, rangeLabel, from, to) {
  const money = (amount) => Math.round(amount * scale)
  const count = (amount) => Math.max(0, Math.round(amount * scale))
  const sales = money(snapshot.sales)
  const membership = money(snapshot.membership)
  const platformFee = money(snapshot.platformFee)
  const orders = count(snapshot.orders)
  const status = snapshot.status.map((item) => ({ ...item, value: count(item.value) }))
  const statusSum = status.reduce((sum, item) => sum + item.value, 0)
  status[0].value = Math.max(0, status[0].value + (orders - statusSum))
  const htoOrders = count(snapshot.htoOrders)
  const earnings = sales + membership + platformFee
  const earningsChart = customSeries(from, to, earnings, inclusiveDays(from, to))
  const ordersChart = customSeries(from, to, orders, inclusiveDays(from, to))
  return {
    ...snapshot,
    range: rangeLabel,
    earnings,
    sales,
    membership,
    platformFee,
    orders,
    ordersHint: `${status[2].value} still open · ${htoOrders} home try-on`,
    customers: count(snapshot.customers),
    newCustomers: count(snapshot.newCustomers),
    reviews: count(snapshot.reviews),
    htoOrders,
    rejectedOrders: count(snapshot.rejectedOrders),
    holdOrders: count(snapshot.holdOrders),
    refunds: money(snapshot.refunds),
    refundCount: count(snapshot.refundCount),
    withdrawalCount: count(snapshot.withdrawalCount),
    optometristCommission: money(snapshot.optometristCommission),
    couponsUsed: count(snapshot.couponsUsed),
    couponDiscount: money(snapshot.couponDiscount),
    discountCount: count(snapshot.discountCount),
    optometristDiscount: money(snapshot.optometristDiscount),
    optometristDiscountUses: count(snapshot.optometristDiscountUses),
    affiliateDiscount: money(snapshot.affiliateDiscount),
    affiliateDiscountUses: count(snapshot.affiliateDiscountUses),
    revenue: money(snapshot.revenue),
    appointments: count(snapshot.appointments),
    affiliateCommission: money(snapshot.affiliateCommission),
    couponRequests: count(snapshot.couponRequests),
    status,
    attention: {
      ...snapshot.attention,
      disputes: count(snapshot.attention.disputes),
      unpaid: count(snapshot.attention.unpaid),
      withdrawals: money(snapshot.attention.withdrawals),
    },
    labels: earningsChart.labels,
    earningsSeries: earningsChart.series,
    ordersSeries: ordersChart.series,
  }
}

export function getSnapshot(period, range) {
  const days = period === 'custom' ? inclusiveDays(range?.fromDate, range?.toDate) : 0
  if (period === 'custom' && !days) return null
  const key = period === 'custom' ? 'year' : (PERIOD_KEY[period] || period)
  const base = snapshots[key] || snapshots.year
  const scale = period === 'custom' ? Math.min(1, days / 320) : (PERIOD_SCALE[key] ?? 1)
  const snapshot = period === 'custom'
    ? scaleSnapshot(base, scale, formatRange(range.fromDate, range.toDate), range.fromDate, range.toDate)
    : { ...base, range: RANGE_LABEL[period] || base.range }
  const scaleAmount = (amount) => Math.round(amount * scale)
  return {
    ...snapshot,
    ordersList: recentOrders,
    optometristBoard: optometrists,
    affiliateBoard: affiliates.map((item) => ({
      ...item,
      uses: Math.max(1, Math.round(item.uses * scale)),
      discount: scaleAmount(item.discount),
      commission: scaleAmount(item.commission),
    })),
    products: products.map((item) => ({ ...item, revenue: scaleAmount(item.revenue) })),
    catalogue: catalogue.map((item) => ({ ...item, amount: scaleAmount(item.amount) })),
    storefronts: storefronts.map((item) => ({
      ...item,
      amount: scaleAmount(item.amount),
      orders: Math.max(1, Math.round(item.orders * scale)),
    })),
  }
}
