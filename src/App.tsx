import React, { useState, useEffect, useRef } from "react";
import { 
  Leaf, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Star, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  ArrowUp, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Check, 
  Eye, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Award,
  Calendar,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { products, feedbacks, faqs, categories } from "./data";
import { Product, Feedback } from "./types";

export default function App() {
  // State definitions
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Cart State
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "success">("cart");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });
  
  // Feedback Carousel State
  const [currentFeedback, setCurrentFeedback] = useState(0);
  const [isHoveredFeedback, setIsHoveredFeedback] = useState(false);
  
  // FAQ Accordion State
  const [openFAQ, setOpenFAQ] = useState<string | null>("faq1");
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Toast notifications
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });
  
  // Back to Top State
  const [showBackToTop, setShowBackToTop] = useState(false);

  // References for Scroll Spy
  const sectionsRef = {
    home: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    products: useRef<HTMLDivElement>(null),
    ingredients: useRef<HTMLDivElement>(null),
    feedback: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null)
  };

  // Toast helper
  const showToastMessage = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast({ message: "", show: false });
    }, 3000);
  };

  // Auto-play for testimonials
  useEffect(() => {
    if (isHoveredFeedback) return;
    const interval = setInterval(() => {
      setCurrentFeedback((prev) => (prev + 1) % feedbacks.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHoveredFeedback]);

  // Scroll handler for Scroll Spy & Back to Top
  useEffect(() => {
    const handleScroll = () => {
      // Back to top visibility
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Scroll Spy
      const scrollPosition = window.scrollY + 120; // offset for sticky header
      
      const homeOffset = sectionsRef.home.current?.offsetTop || 0;
      const aboutOffset = sectionsRef.about.current?.offsetTop || 0;
      const productsOffset = sectionsRef.products.current?.offsetTop || 0;
      const ingredientsOffset = sectionsRef.ingredients.current?.offsetTop || 0;
      const feedbackOffset = sectionsRef.feedback.current?.offsetTop || 0;
      const contactOffset = sectionsRef.contact.current?.offsetTop || 0;

      if (scrollPosition >= contactOffset - 100) {
        setActiveSection("contact");
      } else if (scrollPosition >= feedbackOffset - 100) {
        setActiveSection("feedback");
      } else if (scrollPosition >= ingredientsOffset - 100) {
        setActiveSection("ingredients");
      } else if (scrollPosition >= productsOffset - 100) {
        setActiveSection("products");
      } else if (scrollPosition >= aboutOffset - 100) {
        setActiveSection("about");
      } else {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filtered Products
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToastMessage(`Đã thêm ${quantity} x ${product.name} vào giỏ hàng!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty < 1 ? 1 : newQty };
      }
      return item;
    }));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const isFreeShipping = cartSubtotal >= 300000;
  const shippingFee = isFreeShipping ? 0 : 30000;
  const cartTotal = cartSubtotal + shippingFee;

  // Handle Order Submit
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      showToastMessage("Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }
    setCheckoutStep("success");
    setTimeout(() => {
      setCart([]);
      setCheckoutStep("cart");
      setIsCartOpen(false);
      setShippingInfo({ name: "", phone: "", address: "", notes: "" });
      showToastMessage("Đặt hàng thành công! Cỏ Mềm sẽ liên hệ xác nhận sớm nhất.");
    }, 4000);
  };

  // Contact Form Submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    
    if (!contactForm.name.trim()) errors.name = "Vui lòng nhập họ tên";
    if (!contactForm.email.trim()) {
      errors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      errors.email = "Email không hợp lệ";
    }
    if (!contactForm.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(contactForm.phone.replace(/[\s.-]/g, ""))) {
      errors.phone = "Số điện thoại gồm 10-11 chữ số";
    }
    if (!contactForm.message.trim()) errors.message = "Vui lòng nhập nội dung liên hệ";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToastMessage("Vui lòng điền đúng thông tin liên hệ!");
      return;
    }

    setFormErrors({});
    setFormSubmitted(true);
    showToastMessage("Cảm ơn bạn! Thông tin đã được gửi thành công.");
    
    // Reset form after a while
    setTimeout(() => {
      setContactForm({ name: "", email: "", phone: "", message: "" });
      setFormSubmitted(false);
    }, 5000);
  };

  // Smooth scroll helper
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const top = ref.current.offsetTop - 85; // offset for sticky navbar
      window.scrollTo({
        top,
        behavior: "smooth"
      });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans selection:bg-brand-pink selection:text-brand-dark">
      
      {/* Dynamic Toast Message */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-green text-white px-6 py-3 rounded-full shadow-lg font-medium flex items-center space-x-2 border border-brand-green-dark"
            id="toast-notification"
          >
            <Check className="w-5 h-5 bg-white text-brand-green rounded-full p-0.5" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header (Sticky & Transparent/Solid Transition) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-100 transition-all duration-300 shadow-sm" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer group" 
              onClick={() => scrollTo(sectionsRef.home)}
              id="header-logo"
            >
              <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white transition-transform duration-500 group-hover:rotate-12">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-brand-dark font-serif">Cỏ Mềm</span>
                <span className="text-[10px] uppercase tracking-widest text-brand-green font-medium -mt-1">Lành và Thật</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 lg:space-x-10" id="desktop-nav">
              {[
                { key: "home", label: "Trang chủ" },
                { key: "about", label: "Giới thiệu" },
                { key: "products", label: "Sản phẩm" },
                { key: "ingredients", label: "Thành phần" },
                { key: "feedback", label: "Khách hàng" },
                { key: "contact", label: "Liên hệ" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollTo(sectionsRef[item.key as keyof typeof sectionsRef])}
                  className={`text-sm font-medium transition-colors relative py-2 ${
                    activeSection === item.key 
                      ? "text-brand-green font-semibold" 
                      : "text-neutral-500 hover:text-brand-green"
                  }`}
                  id={`nav-link-${item.key}`}
                >
                  {item.label}
                  {activeSection === item.key && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-brand-green rounded-full"
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-4" id="header-right-actions">
              {/* Shopping Cart Trigger */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full hover:bg-neutral-100 transition-colors duration-200 group text-neutral-600 hover:text-brand-green"
                aria-label="Xem giỏ hàng"
                id="cart-trigger"
              >
                <ShoppingCart className="w-5.5 h-5.5 transition-transform group-hover:scale-105" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-accent text-white font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse-soft">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Mua Ngay Call-To-Action */}
              <button
                onClick={() => scrollTo(sectionsRef.products)}
                className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-brand-green hover:bg-brand-green-dark text-white text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                id="header-cta-btn"
              >
                Mua ngay
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors"
                aria-label="Mở menu"
                id="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-neutral-100"
              id="mobile-nav-panel"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                {[
                  { key: "home", label: "Trang chủ" },
                  { key: "about", label: "Giới thiệu" },
                  { key: "products", label: "Sản phẩm" },
                  { key: "ingredients", label: "Thành phần" },
                  { key: "feedback", label: "Khách hàng" },
                  { key: "contact", label: "Liên hệ" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => scrollTo(sectionsRef[item.key as keyof typeof sectionsRef])}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      activeSection === item.key 
                        ? "bg-brand-green-light text-brand-green-dark font-semibold" 
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                    id={`mobile-nav-link-${item.key}`}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollTo(sectionsRef.products);
                  }}
                  className="w-full mt-4 flex items-center justify-center py-3 bg-brand-green hover:bg-brand-green-dark text-white rounded-full font-medium transition-colors"
                  id="mobile-nav-cta"
                >
                  Mua ngay
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero Banner Section */}
      <section 
        ref={sectionsRef.home} 
        className="relative overflow-hidden pt-10 pb-20 md:py-24 bg-gradient-to-br from-brand-green-light via-white to-brand-pink-light"
        id="hero-section"
      >
        {/* Floating background decorative blobs */}
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-brand-green/10 blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-brand-pink/20 blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column Content */}
            <div className="lg:col-span-6 space-y-6 md:space-y-8 text-center lg:text-left" id="hero-content">
              {/* Top accent badge */}
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white border border-brand-green/20 rounded-full text-xs font-semibold text-brand-green-dark shadow-xs animate-pulse-soft">
                <Sparkles className="w-3.5 h-3.5 text-brand-green" />
                <span>Mỹ Phẩm Lành Và Thật Từ Thiên Nhiên</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-dark leading-[1.1] font-serif" id="hero-title">
                Lành từ cỏ - <br className="hidden sm:inline" />
                <span className="text-brand-green">Đẹp từ tâm</span>
              </h1>
              
              <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed" id="hero-description">
                Mỹ phẩm thiên nhiên an toàn, lành tính, được nghiên cứu dành riêng cho cấu trúc làn da người Việt. Mỗi giọt tinh chất là một sự cam kết tuyệt đối về độ an toàn.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4" id="hero-actions">
                <button
                  onClick={() => scrollTo(sectionsRef.about)}
                  className="w-full sm:w-auto px-8 py-4 bg-brand-green hover:bg-brand-green-dark text-white rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                  id="hero-btn-discover"
                >
                  <span>Khám phá ngay</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollTo(sectionsRef.products)}
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-full font-semibold transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center"
                  id="hero-btn-products"
                >
                  Xem sản phẩm
                </button>
              </div>

              {/* Minimalist Trust Stats */}
              <div className="pt-6 sm:pt-10 grid grid-cols-3 gap-4 border-t border-brand-green/10 max-w-md mx-auto lg:mx-0" id="hero-stats">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-brand-dark font-serif">100%</p>
                  <p className="text-xs text-neutral-500 font-medium">Thiên nhiên tinh khiết</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-brand-dark font-serif">0%</p>
                  <p className="text-xs text-neutral-500 font-medium">Hóa chất gây hại</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-brand-dark font-serif">2M+</p>
                  <p className="text-xs text-neutral-500 font-medium">Khách hàng tin chọn</p>
                </div>
              </div>
            </div>

            {/* Right Column Banner Artwork */}
            <div className="lg:col-span-6 flex justify-center relative" id="hero-banner-visual">
              {/* Backdrop shape */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/20 to-brand-pink/30 rounded-[40px] transform rotate-3 scale-95 blur-xs -z-10" />
              
              <div className="relative w-full max-w-lg rounded-[30px] overflow-hidden border-8 border-white/80 shadow-xl aspect-4/3 bg-neutral-100">
                {/* Embedded generated banner image */}
                <img 
                  src="./assets/images/co_mem_hero_banner_1783491093656.jpg" 
                  alt="Mỹ phẩm thiên nhiên Cỏ Mềm tinh tế" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                  referrerPolicy="no-referrer"
                  id="hero-banner-image"
                />
                
                {/* Absolute overlay badge */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl shadow-lg border border-brand-green-light flex items-center space-x-3 max-w-[240px] sm:max-w-xs animate-bounce-slow">
                  <div className="w-10 h-10 rounded-full bg-brand-pink flex items-center justify-center text-brand-accent shrink-0">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-brand-dark leading-tight">An toàn cho Mẹ & Bé</h4>
                    <p className="text-[10px] sm:text-xs text-neutral-500">Được khuyên dùng bởi dược sĩ</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Giới thiệu thương hiệu (About Section) */}
      <section 
        ref={sectionsRef.about} 
        className="py-20 md:py-28 bg-white" 
        id="about-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4" id="about-header">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-green bg-brand-green-light px-3 py-1 rounded-full">
              Triết Lý Thương Hiệu
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark font-serif" id="about-title">
              Vì sao chọn Cỏ Mềm?
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto leading-relaxed">
              Chúng tôi luôn khát khao định nghĩa lại mỹ phẩm Việt bằng sự trung thực tuyệt đối. Mỗi sản phẩm đều được làm từ những thành phần thật nhất, lành dịu nhất cho da bạn.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" id="about-features-grid">
            {[
              {
                icon: <Leaf className="w-7 h-7 text-brand-green" />,
                title: "Thành phần thiên nhiên",
                desc: "Khai thác tối đa nguồn dược liệu Việt bản địa quý giá, giữ nguyên bản chất tinh khiết của tự nhiên.",
                bgColor: "bg-emerald-50",
                borderColor: "border-emerald-100",
                iconBg: "bg-emerald-100"
              },
              {
                icon: <ShieldCheck className="w-7 h-7 text-brand-green" />,
                title: "An toàn cho da",
                desc: "Được nghiên cứu bởi đội ngũ dược sĩ uy tín, đáp ứng các tiêu chuẩn khắt khe nhất về an toàn sinh học.",
                bgColor: "bg-teal-50",
                borderColor: "border-teal-100",
                iconBg: "bg-teal-100"
              },
              {
                icon: <Award className="w-7 h-7 text-brand-green" />,
                title: "Không hóa chất độc hại",
                desc: "Cam kết 100% không chứa Paraben, Silicon, Corticoid, hương liệu nhân tạo hay chất tẩy rửa công nghiệp.",
                bgColor: "bg-pink-50/70",
                borderColor: "border-pink-100/50",
                iconBg: "bg-brand-pink-light"
              },
              {
                icon: <Sparkles className="w-7 h-7 text-brand-green" />,
                title: "Thân thiện môi trường",
                desc: "Quy trình sản xuất xanh, bao bì phân hủy sinh học tự nhiên, nói không với việc thử nghiệm trên động vật.",
                bgColor: "bg-lime-50",
                borderColor: "border-lime-100",
                iconBg: "bg-lime-100"
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`p-6 sm:p-8 rounded-[20px] border ${card.borderColor} ${card.bgColor} shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col items-center text-center space-y-4 group`}
                id={`about-card-${idx}`}
              >
                <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center transition-transform duration-500 group-hover:rotate-6`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-brand-dark">{card.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Core Vision Highlight Section */}
          <div className="mt-16 bg-gradient-to-r from-brand-green/5 to-brand-pink/10 rounded-[30px] p-6 sm:p-10 border border-brand-green/10 flex flex-col md:flex-row items-center justify-between gap-8" id="about-brand-promise">
            <div className="space-y-3 max-w-2xl text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-brand-dark font-serif">Mỹ Phẩm Việt Lành Và Thật</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Tại phòng Lab hiện đại của Cỏ Mềm, chúng tôi tin rằng thiên nhiên nắm giữ chiếc chìa khóa cho vẻ đẹp đích thực. Chúng tôi cam kết minh bạch 100% bảng thành phần trên từng nhãn hộp.
              </p>
            </div>
            <div className="flex gap-4 sm:gap-6 shrink-0">
              <div className="bg-white px-5 py-4 rounded-2xl shadow-sm text-center border border-neutral-100">
                <p className="text-2xl font-bold text-brand-green">100%</p>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Lành tính</p>
              </div>
              <div className="bg-white px-5 py-4 rounded-2xl shadow-sm text-center border border-neutral-100">
                <p className="text-2xl font-bold text-brand-green">Lab</p>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Đạt chuẩn CGMP</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Danh mục sản phẩm nổi bật (Products Section) */}
      <section 
        ref={sectionsRef.products} 
        className="py-20 md:py-28 bg-neutral-50" 
        id="products-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4" id="products-header">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-green bg-brand-green-light px-3 py-1 rounded-full">
              Cửa Hàng Trực Tuyến
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark font-serif" id="products-title">
              Sản phẩm nổi bật
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto">
              Chăm sóc toàn diện từ thiên nhiên lành tính. Hãy chọn dòng sản phẩm yêu thích và bắt đầu hành trình nâng niu làn da của bạn.
            </p>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10" id="products-tabs">
            {categories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  selectedCategory === tab.id
                    ? "bg-brand-green text-white shadow-md shadow-brand-green/20"
                    : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                }`}
                id={`category-tab-${tab.id}`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" id="products-grid">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                  className="bg-white rounded-[20px] overflow-hidden border border-neutral-100 shadow-soft hover:shadow-soft-hover transition-all duration-300 group flex flex-col h-full relative"
                  id={`product-card-${product.id}`}
                >
                  {/* Badge tags */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-brand-accent text-white font-bold text-[10px] px-2.5 py-1 rounded-full tracking-wider uppercase shadow-xs">
                        Mới
                      </span>
                    )}
                    {product.salesCount > 1000 && (
                      <span className="bg-brand-green text-white font-bold text-[10px] px-2.5 py-1 rounded-full tracking-wider uppercase shadow-xs">
                        Bán chạy
                      </span>
                    )}
                  </div>

                  {/* Product image with overlay */}
                  <div className="relative aspect-4/3 overflow-hidden bg-neutral-100 shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      id={`product-image-${product.id}`}
                    />
                    {/* Dark gradient mask */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* View details button hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="bg-white/95 text-brand-dark font-medium text-xs px-5 py-2.5 rounded-full shadow-lg border border-neutral-100 flex items-center space-x-1.5 transition-transform duration-300 hover:scale-105"
                        id={`product-hover-view-${product.id}`}
                      >
                        <Eye className="w-4 h-4 text-brand-green" />
                        <span>Xem chi tiết</span>
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-brand-green">
                        {product.category === "lips" ? "Môi" : product.category === "skincare" ? "Chăm sóc da" : product.category === "hair" ? "Chăm sóc tóc" : "Cơ thể"}
                      </span>
                      {/* Rating representation */}
                      <div className="flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-neutral-600">{product.rating}</span>
                      </div>
                    </div>

                    <h3 
                      onClick={() => setSelectedProduct(product)}
                      className="text-lg font-bold text-brand-dark hover:text-brand-green transition-colors cursor-pointer line-clamp-1"
                      id={`product-title-${product.id}`}
                    >
                      {product.name}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-neutral-500 line-clamp-2 leading-relaxed flex-grow">
                      {product.shortDescription}
                    </p>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      {/* Price tag */}
                      <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400 uppercase font-medium">Giá bán lẻ</span>
                        <span className="text-lg font-extrabold text-brand-dark">
                          {product.price.toLocaleString("vi-VN")}đ
                        </span>
                      </div>

                      {/* Add to Cart button */}
                      <button
                        onClick={() => addToCart(product)}
                        className="p-3 bg-brand-green-light hover:bg-brand-green text-brand-green-dark hover:text-white rounded-full transition-all duration-300 shadow-xs hover:shadow-md"
                        title="Thêm vào giỏ hàng"
                        id={`product-add-cart-${product.id}`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 5. Thành phần thiên nhiên (Ingredients Section) */}
      <section 
        ref={sectionsRef.ingredients} 
        className="py-20 md:py-28 bg-white" 
        id="ingredients-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column Illustrating Ingredients */}
            <div className="lg:col-span-5 relative flex justify-center order-last lg:order-first" id="ingredients-visual">
              {/* Decorative light background ring */}
              <div className="absolute inset-0 bg-brand-green-light/40 rounded-[40px] transform -rotate-3 scale-102 -z-10" />
              
              <div className="w-full max-w-md rounded-[30px] overflow-hidden border-8 border-white shadow-xl aspect-square bg-neutral-100">
                <img 
                  src="./assets/images/co_mem_ingredients_1783491109071.jpg" 
                  alt="Thành phần mỹ phẩm 100% tự nhiên của Cỏ Mềm" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  id="ingredients-banner-image"
                />
              </div>

              {/* Float Badge */}
              <div className="absolute top-10 right-4 bg-white/95 backdrop-blur-xs p-4 rounded-2xl shadow-lg border border-brand-green-light text-center max-w-[150px] animate-pulse-soft">
                <Leaf className="w-6 h-6 text-brand-green mx-auto mb-1" />
                <span className="block text-xs font-extrabold text-brand-dark">100% Cam Kết</span>
                <span className="block text-[10px] text-brand-green font-medium">Organic thiên nhiên</span>
              </div>
            </div>

            {/* Right Column Core Values & Claims */}
            <div className="lg:col-span-7 space-y-8" id="ingredients-content">
              <div className="space-y-4">
                <span className="text-xs uppercase font-bold tracking-widest text-brand-green bg-brand-green-light px-3 py-1 rounded-full">
                  Cam Kết Chất Lượng
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark font-serif" id="ingredients-title">
                  Cam kết 100% nguyên chất lành tính
                </h2>
                <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
                  Chúng tôi nói không với các chất làm đẹp thần tốc gây tổn thương màng sinh học tự nhiên của làn da. Mỗi sản phẩm được bào chế tỉ mỉ để chăm sóc nhẹ nhàng và bền vững nhất.
                </p>
              </div>

              {/* Claims List */}
              <div className="space-y-4" id="ingredients-claims-list">
                {[
                  {
                    title: "100% nguồn gốc thiên nhiên",
                    desc: "Tất cả các loại tinh dầu, bột củ quả, thảo mộc khô đều được thu hoạch trực tiếp tại vùng nông nghiệp chất lượng cao Việt Nam và thế giới.",
                    color: "bg-emerald-500"
                  },
                  {
                    title: "Không chứa chất bảo quản Paraben",
                    desc: "Sử dụng các gốc kháng khuẩn thực vật cao cấp giúp bảo quản sản phẩm một cách an toàn mà hoàn toàn không gây dị ứng.",
                    color: "bg-teal-500"
                  },
                  {
                    title: "Không Silicone gây bít tắc da",
                    desc: "Để lỗ chân lông được thở tự nhiên, da căng bóng tự nhiên nhờ các loại axit béo lành tính từ hạt quả bơ và hạt mỡ.",
                    color: "bg-lime-500"
                  },
                  {
                    title: "Không Corticoid bào mòn da",
                    desc: "Tuyệt đối không sử dụng hoạt chất làm trắng tức thời, giữ gìn độ dày tự nhiên của lớp biểu bì da.",
                    color: "bg-brand-pink-dark"
                  },
                  {
                    title: "Dịu nhẹ tối đa cho da nhạy cảm",
                    desc: "Công thức tối giản, hạn chế tối đa các thành phần phức tạp để tập trung bảo vệ tốt nhất làn da nhạy cảm nhất.",
                    color: "bg-brand-accent"
                  }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex gap-4 p-4 rounded-2xl hover:bg-neutral-50 transition-colors duration-200"
                    id={`ingredients-claim-${idx}`}
                  >
                    <div className="shrink-0 pt-1">
                      <div className={`w-5 h-5 rounded-full ${item.color} flex items-center justify-center text-white`}>
                        <Check className="w-3.5 h-3.5 p-0.5" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm sm:text-base font-bold text-brand-dark">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Feedback khách hàng (Testimonials Section) */}
      <section 
        ref={sectionsRef.feedback} 
        className="py-20 md:py-28 bg-gradient-to-tr from-brand-pink-light/30 via-white to-brand-green-light/30 overflow-hidden" 
        id="feedback-section"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4" id="feedback-header">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-green bg-brand-green-light px-3 py-1 rounded-full">
              Khách Hàng Chia Sẻ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark font-serif" id="feedback-title">
              Cảm nhận từ khách hàng
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 max-w-md mx-auto">
              Hạnh phúc của chúng tôi là được ngắm nhìn nụ cười rạng ngời và làn da khỏe khoắn thực sự của bạn mỗi ngày.
            </p>
          </div>

          {/* Interactive Testimonial Slider Panel */}
          <div 
            className="relative bg-white rounded-[25px] border border-brand-green/10 shadow-soft p-8 sm:p-12 md:p-16 flex flex-col md:flex-row gap-8 sm:gap-12 items-center"
            onMouseEnter={() => setIsHoveredFeedback(true)}
            onMouseLeave={() => setIsHoveredFeedback(false)}
            id="feedback-slider-panel"
          >
            {/* Absolute quotation mark */}
            <span className="absolute top-6 left-8 text-8xl font-serif text-brand-pink/30 select-none pointer-events-none">“</span>

            {/* Slide Animator */}
            <div className="w-full" id="feedback-slider-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeedback}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
                >
                  {/* Left Column Avatar */}
                  <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-brand-pink shadow-md">
                      <img 
                        src={feedbacks[currentFeedback].avatar} 
                        alt={feedbacks[currentFeedback].name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-brand-dark">{feedbacks[currentFeedback].name}</h4>
                      <p className="text-[11px] sm:text-xs text-brand-green font-semibold uppercase tracking-wider">
                        {feedbacks[currentFeedback].role}
                      </p>
                    </div>
                  </div>

                  {/* Right Column Stars & Review */}
                  <div className="md:col-span-8 space-y-4 flex flex-col items-center md:items-start text-center md:text-left">
                    {/* Stars bar */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: feedbacks[currentFeedback].rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed italic">
                      "{feedbacks[currentFeedback].comment}"
                    </p>

                    <div className="inline-flex items-center space-x-1 bg-neutral-50 px-3.5 py-1.5 rounded-full border border-neutral-100 text-[11px] text-neutral-500 font-medium">
                      <ShieldCheck className="w-4 h-4 text-brand-green" />
                      <span>Chứng nhận khách hàng đã mua sản phẩm</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Prev/Next Navigation Controls */}
            <div className="absolute bottom-6 right-8 flex items-center space-x-2" id="feedback-slider-controls">
              <button
                onClick={() => setCurrentFeedback((prev) => (prev - 1 + feedbacks.length) % feedbacks.length)}
                className="p-2 bg-neutral-50 hover:bg-brand-pink-light rounded-full border border-neutral-100 text-neutral-500 hover:text-brand-accent transition-colors"
                aria-label="Nhận xét trước"
                id="feedback-prev-btn"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Dots bar */}
              <div className="flex items-center space-x-1.5 px-1">
                {feedbacks.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentFeedback(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentFeedback === idx ? "w-6 bg-brand-green" : "w-2 bg-neutral-200 hover:bg-neutral-300"
                    }`}
                    aria-label={`Đi tới nhận xét ${idx + 1}`}
                    id={`feedback-dot-${idx}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentFeedback((prev) => (prev + 1) % feedbacks.length)}
                className="p-2 bg-neutral-50 hover:bg-brand-pink-light rounded-full border border-neutral-100 text-neutral-500 hover:text-brand-accent transition-colors"
                aria-label="Nhận xét tiếp"
                id="feedback-next-btn"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Khuyến mãi Section (Promo Banner) */}
      <section className="py-12 bg-white" id="promo-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-brand-green-dark via-brand-green to-brand-pink-dark p-8 sm:p-12 md:p-16 text-white shadow-xl" id="promo-banner">
            
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-black/10 rounded-full blur-2xl" />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Content text */}
              <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
                <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider rounded-full">
                  Ưu đãi chào hè độc quyền
                </span>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif">
                  Giảm tới 30% cho đơn hàng đầu tiên
                </h3>
                <p className="text-sm sm:text-base text-brand-green-light max-w-xl mx-auto lg:mx-0">
                  Hãy đăng ký trải nghiệm ngay hôm nay để nhận thêm một phần quà tặng độc quyền là sáp dưỡng môi gạo trị giá 90.000đ.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-medium text-white/90 pt-2">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-pink" />
                    <span>Miễn phí giao hàng từ 300K</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-pink" />
                    <span>Hộp quà tặng sinh thái mộc mạc</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="lg:col-span-4 flex justify-center lg:justify-end shrink-0">
                <button
                  onClick={() => scrollTo(sectionsRef.products)}
                  className="px-8 py-4 bg-white hover:bg-brand-pink-light text-brand-green-dark hover:text-brand-accent font-bold text-base sm:text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-103"
                  id="promo-cta-btn"
                >
                  Mua ngay
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FAQ Section Accordion */}
      <section className="py-20 md:py-28 bg-neutral-50" id="faq-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4" id="faq-header">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-green bg-brand-green-light px-3 py-1 rounded-full">
              Hỗ Trợ Khách Hàng
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark font-serif" id="faq-title">
              Câu hỏi thường gặp
            </h2>
            <p className="text-sm sm:text-base text-neutral-500">
              Giải đáp thắc mắc của quý khách về nguồn gốc, quy trình sản xuất và chính sách chăm sóc khách hàng của Cỏ Mềm.
            </p>
          </div>

          {/* Accordion panel */}
          <div className="space-y-4" id="faq-accordion-panel">
            {faqs.map((faq) => {
              const isOpen = openFAQ === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-neutral-100 shadow-xs overflow-hidden transition-all duration-300"
                  id={`faq-item-${faq.id}`}
                >
                  {/* Trigger Header */}
                  <button
                    onClick={() => setOpenFAQ(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-hidden group"
                    id={`faq-trigger-${faq.id}`}
                  >
                    <span className="text-sm sm:text-base font-bold text-brand-dark group-hover:text-brand-green transition-colors">
                      {faq.question}
                    </span>
                    <span className={`p-1.5 rounded-full ${isOpen ? "bg-brand-green/10 text-brand-green-dark" : "bg-neutral-50 text-neutral-400"} transition-colors shrink-0 ml-4`}>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 transform rotate-180 transition-transform duration-300" />
                      ) : (
                        <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                      )}
                    </span>
                  </button>

                  {/* Answer Container */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-5 pb-6 sm:px-6 sm:pb-7 text-xs sm:text-sm text-neutral-500 leading-relaxed border-t border-neutral-50 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. Form liên hệ (Contact Section) */}
      <section 
        ref={sectionsRef.contact} 
        className="py-20 md:py-28 bg-white" 
        id="contact-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Column Brand Contact Info */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-brand-green-light/40 border border-brand-green/10 p-8 sm:p-10 rounded-[30px]" id="contact-info-panel">
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="text-xs uppercase font-bold tracking-widest text-brand-green">
                    Thông Tin Liên Hệ
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-dark font-serif" id="contact-panel-title">
                    Gửi yêu cầu nhận tư vấn miễn phí
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Đội ngũ dược sĩ giàu kinh nghiệm của Cỏ Mềm luôn túc trực lắng nghe và hỗ trợ soi da, thiết lập liệu trình chăm sóc da khoa học, an toàn nhất cho riêng bạn.
                  </p>
                </div>

                <div className="space-y-4 pt-4" id="contact-info-list">
                  <div className="flex items-start space-x-3 text-neutral-600">
                    <MapPin className="w-5.5 h-5.5 text-brand-green shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm leading-relaxed">
                      <p className="font-bold text-brand-dark">Trụ sở chính Cỏ Mềm</p>
                      <p>Số 225 Tây Sơn, phường Ngã Tư Sở, quận Đống Đa, Hà Nội</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-neutral-600">
                    <Phone className="w-5 h-5 text-brand-green shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold">1800 646 890 (Miễn cước gọi)</span>
                  </div>

                  <div className="flex items-center space-x-3 text-neutral-600">
                    <Mail className="w-5 h-5 text-brand-green shrink-0" />
                    <span className="text-xs sm:text-sm">lienhe@comem.vn</span>
                  </div>

                  <div className="flex items-center space-x-3 text-neutral-600">
                    <Clock className="w-5 h-5 text-brand-green shrink-0" />
                    <span className="text-xs sm:text-sm">Giờ mở cửa: 08:00 - 21:30 hàng ngày</span>
                  </div>
                </div>
              </div>

              {/* Eco Note */}
              <div className="pt-6 border-t border-brand-green/10 flex items-center space-x-3 bg-white/50 p-4 rounded-xl" id="contact-eco-badge">
                <Leaf className="w-8 h-8 text-brand-green shrink-0 p-1.5 bg-white rounded-full shadow-xs" />
                <p className="text-[11px] text-neutral-500 leading-normal font-medium">
                  Cỏ Mềm cam kết trích 1% doanh thu hàng tháng phục vụ các chương trình bảo vệ tài nguyên nước bản địa.
                </p>
              </div>
            </div>

            {/* Right Column Validation Form */}
            <div className="lg:col-span-7 bg-white border border-neutral-100 p-8 sm:p-10 rounded-[30px] shadow-soft" id="contact-form-panel">
              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleContactSubmit}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label htmlFor="form-name" className="text-xs font-bold uppercase text-neutral-500">
                          Họ và tên <span className="text-brand-accent">*</span>
                        </label>
                        <input
                          type="text"
                          id="form-name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Nguyễn Văn A"
                          className={`w-full px-4 py-3 bg-neutral-50 border ${formErrors.name ? "border-brand-accent focus:ring-brand-accent" : "border-neutral-200 focus:ring-brand-green"} rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:bg-white transition-all duration-200`}
                        />
                        {formErrors.name && (
                          <p className="text-[11px] text-brand-accent font-medium">{formErrors.name}</p>
                        )}
                      </div>

                      {/* Phone input */}
                      <div className="space-y-1.5">
                        <label htmlFor="form-phone" className="text-xs font-bold uppercase text-neutral-500">
                          Số điện thoại <span className="text-brand-accent">*</span>
                        </label>
                        <input
                          type="tel"
                          id="form-phone"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          placeholder="0987xxxxxx"
                          className={`w-full px-4 py-3 bg-neutral-50 border ${formErrors.phone ? "border-brand-accent focus:ring-brand-accent" : "border-neutral-200 focus:ring-brand-green"} rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:bg-white transition-all duration-200`}
                        />
                        {formErrors.phone && (
                          <p className="text-[11px] text-brand-accent font-medium">{formErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Email input */}
                    <div className="space-y-1.5">
                      <label htmlFor="form-email" className="text-xs font-bold uppercase text-neutral-500">
                        Địa chỉ Email <span className="text-brand-accent">*</span>
                      </label>
                      <input
                        type="text"
                        id="form-email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className={`w-full px-4 py-3 bg-neutral-50 border ${formErrors.email ? "border-brand-accent focus:ring-brand-accent" : "border-neutral-200 focus:ring-brand-green"} rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:bg-white transition-all duration-200`}
                      />
                      {formErrors.email && (
                        <p className="text-[11px] text-brand-accent font-medium">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Message input */}
                    <div className="space-y-1.5">
                      <label htmlFor="form-message" className="text-xs font-bold uppercase text-neutral-500">
                        Nội dung cần tư vấn <span className="text-brand-accent">*</span>
                      </label>
                      <textarea
                        id="form-message"
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Hãy ghi chi tiết tình trạng làn da hoặc dòng sản phẩm bạn đang quan tâm..."
                        className={`w-full px-4 py-3 bg-neutral-50 border ${formErrors.message ? "border-brand-accent focus:ring-brand-accent" : "border-neutral-200 focus:ring-brand-green"} rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:bg-white transition-all duration-200 resize-none`}
                      />
                      {formErrors.message && (
                        <p className="text-[11px] text-brand-accent font-medium">{formErrors.message}</p>
                      )}
                    </div>

                    {/* Action Submit */}
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 py-4 bg-brand-green hover:bg-brand-green-dark text-white rounded-full font-bold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg"
                      id="contact-submit-btn"
                    >
                      <Send className="w-5 h-5" />
                      <span>Gửi thông tin tư vấn</span>
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-card"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                    id="contact-success-panel"
                  >
                    <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl sm:text-2xl font-bold text-brand-dark">Gửi thành công!</h4>
                      <p className="text-sm text-neutral-500 max-w-sm">
                        Cảm ơn bạn đã lựa chọn Cỏ Mềm. Chuyên viên chăm sóc khách hàng của chúng tôi sẽ liên hệ lại với bạn trong vòng 24 giờ tới.
                      </p>
                    </div>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs font-bold text-brand-green-dark hover:underline"
                    >
                      Gửi tiếp một yêu cầu khác
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* 10. Footer Section */}
      <footer className="bg-brand-dark text-neutral-300 pt-16 pb-8" id="footer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10" id="footer-grid">
            
            {/* Logo/Intro block */}
            <div className="md:col-span-4 space-y-4">
              <div 
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={() => scrollTo(sectionsRef.home)}
                id="footer-logo"
              >
                <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-white font-serif">Cỏ Mềm</span>
                  <span className="text-[10px] uppercase tracking-widest text-brand-green font-medium -mt-1">Lành và Thật</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Mỹ phẩm thiên nhiên Cỏ Mềm được thành lập bởi những người Dược sĩ muốn đem tinh túy thảo mộc Việt nâng niu làn da của bạn bằng tất cả sự chân thành.
              </p>
            </div>

            {/* Menu column */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2">
                Liên kết nhanh
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {[
                  { key: "home", label: "Trang chủ" },
                  { key: "about", label: "Giới thiệu" },
                  { key: "products", label: "Sản phẩm" },
                  { key: "ingredients", label: "Thành phần" },
                  { key: "feedback", label: "Khách hàng" },
                ].map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => scrollTo(sectionsRef[item.key as keyof typeof sectionsRef])}
                      className="text-neutral-400 hover:text-white transition-colors text-left"
                      id={`footer-nav-link-${item.key}`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact quick block */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2">
                Địa chỉ liên lạc
              </h4>
              <ul className="space-y-3 text-xs text-neutral-400 leading-relaxed">
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4.5 h-4.5 text-brand-green shrink-0 mt-0.5" />
                  <span>Số 225 Tây Sơn, phường Ngã Tư Sở, Đống Đa, Hà Nội</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-brand-green shrink-0" />
                  <span>1800 646 890</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-brand-green shrink-0" />
                  <span>lienhe@comem.vn</span>
                </li>
              </ul>
            </div>

            {/* Social accounts */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2">
                Kết nối với Cỏ Mềm
              </h4>
              <p className="text-xs text-neutral-400 leading-normal">
                Theo dõi chúng tôi trên mạng xã hội để cập nhật những ưu đãi, bài viết hữu ích sớm nhất.
              </p>
              <div className="flex space-x-3" id="footer-social-links">
                {["Facebook", "Instagram", "TikTok"].map((social) => (
                  <a
                    key={social}
                    href={`#${social.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      showToastMessage(`Đang chuyển hướng sang ${social} của Cỏ Mềm...`);
                    }}
                    className="px-3.5 py-2 bg-white/5 hover:bg-brand-green rounded-lg text-xs font-semibold text-neutral-300 hover:text-white transition-all duration-300"
                    id={`footer-social-${social}`}
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Sub-footer notes */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500" id="sub-footer">
            <p>
              &copy; 2026 Cỏ Mềm. Tất cả quyền được bảo lưu. <span className="text-neutral-600">| Thiết kế chuẩn UX/UI môn Truyền thông đa phương tiện.</span>
            </p>
            <div className="flex space-x-6">
              <a href="#privacy" className="hover:text-white transition-colors" onClick={(e) => {e.preventDefault(); showToastMessage("Chính sách bảo mật");}}>Chính sách bảo mật</a>
              <a href="#terms" className="hover:text-white transition-colors" onClick={(e) => {e.preventDefault(); showToastMessage("Điều khoản sử dụng");}}>Điều khoản sử dụng</a>
            </div>
          </div>

        </div>
      </footer>

      {/* 11. Interactive Product Detail Dialog Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" id="product-modal">
            {/* Modal backdrop closer */}
            <div className="absolute inset-0" onClick={() => setSelectedProduct(null)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-[25px] w-full max-w-3xl overflow-hidden shadow-2xl border border-neutral-100 max-h-[90vh] flex flex-col relative z-10"
              id="product-modal-content"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-neutral-100/80 hover:bg-neutral-100 text-neutral-600 rounded-full transition-colors"
                aria-label="Đóng cửa sổ"
                id="product-modal-close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Container */}
              <div className="overflow-y-auto p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Left Column product media */}
                  <div className="relative aspect-square md:aspect-auto md:h-full min-h-[250px] bg-neutral-50 rounded-2xl overflow-hidden">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {selectedProduct.isNew && (
                      <span className="absolute top-3 left-3 bg-brand-accent text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase">
                        Sản phẩm mới
                      </span>
                    )}
                  </div>

                  {/* Right Column content detail */}
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-green bg-brand-green-light px-2.5 py-1 rounded-full">
                        {selectedProduct.category === "lips" ? "Son môi" : selectedProduct.category === "skincare" ? "Chăm sóc da" : selectedProduct.category === "hair" ? "Chăm sóc tóc" : "Cơ thể"}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-brand-dark font-serif leading-tight">
                        {selectedProduct.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-neutral-500">
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 fill-current ${i < Math.floor(selectedProduct.rating) ? "fill-amber-400" : "text-neutral-200"}`} />
                          ))}
                        </div>
                        <span className="font-semibold text-brand-dark">{selectedProduct.rating}</span>
                        <span>•</span>
                        <span>Đã bán {selectedProduct.salesCount}</span>
                      </div>
                    </div>

                    <div className="text-xl font-extrabold text-brand-green-dark">
                      {selectedProduct.price.toLocaleString("vi-VN")}đ
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                      {selectedProduct.description}
                    </p>

                    {/* Dynamic Accordion list for detail */}
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Thành phần nổi bật:</span>
                        <ul className="space-y-1">
                          {selectedProduct.ingredients.map((ing, index) => (
                            <li key={index} className="text-xs text-neutral-600 flex items-start gap-1.5">
                              <span className="text-brand-green font-bold shrink-0">•</span>
                              <span>{ing}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1 pt-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Hướng dẫn sử dụng:</span>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          {selectedProduct.usage}
                        </p>
                      </div>
                    </div>

                    {/* Action Bar inside modal */}
                    <div className="pt-4 border-t border-neutral-100 flex items-center gap-4">
                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                          setSelectedProduct(null);
                        }}
                        className="flex-grow flex items-center justify-center space-x-2 py-3 bg-brand-green hover:bg-brand-green-dark text-white rounded-full font-semibold text-sm sm:text-base transition-colors shadow-md"
                        id="modal-add-to-cart-btn"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Thêm vào giỏ hàng</span>
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 12. Floating Shopping Cart Sliding Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs" id="cart-drawer">
            {/* Click backdrop to close */}
            <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white w-full max-w-md h-full shadow-2xl relative z-10 flex flex-col"
              id="cart-drawer-content"
            >
              {/* Header */}
              <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                <div className="flex items-center space-x-2 text-brand-dark">
                  <ShoppingCart className="w-5.5 h-5.5 text-brand-green" />
                  <span className="font-bold text-lg font-serif">Giỏ hàng của bạn</span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 hover:bg-neutral-200 text-neutral-500 rounded-full transition-colors"
                  id="cart-drawer-close"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* Progress Bar for Free Shipping */}
              {cart.length > 0 && checkoutStep !== "success" && (
                <div className="bg-brand-green-light/60 p-4 border-b border-brand-green/10 text-xs text-brand-green-dark">
                  {isFreeShipping ? (
                    <div className="flex items-center space-x-1.5 font-bold">
                      <Check className="w-4 h-4 bg-brand-green text-white rounded-full p-0.5" />
                      <span>Chúc mừng! Bạn đã được Miễn phí vận chuyển toàn quốc</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <p>
                        Mua thêm <strong className="text-brand-accent">{(300000 - cartSubtotal).toLocaleString("vi-VN")}đ</strong> để được <strong>Miễn phí vận chuyển toàn quốc</strong>.
                      </p>
                      {/* Percent progress line */}
                      <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-brand-green h-full rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min((cartSubtotal / 300000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Body Content */}
              <div className="flex-grow overflow-y-auto p-5">
                <AnimatePresence mode="wait">
                  {checkoutStep === "success" ? (
                    /* Checkout Success Message animation */
                    <motion.div
                      key="success"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4"
                      id="cart-success-flow"
                    >
                      <div className="w-20 h-20 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green shadow-sm animate-pulse-soft">
                        <Check className="w-12 h-12" />
                      </div>
                      <h4 className="text-xl font-bold text-brand-dark font-serif">Đặt hàng thành công!</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
                        Đơn hàng của quý khách đã được lưu nhận trên hệ thống kiểm nghiệm. Nhân viên Cỏ Mềm sẽ gọi điện xác thực thông tin và giao hàng sớm nhất. Xin chân thành cảm ơn!
                      </p>
                    </motion.div>
                  ) : checkoutStep === "form" ? (
                    /* Order Shipping Form */
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleOrderSubmit}
                      className="space-y-4"
                      id="cart-shipping-form"
                    >
                      <button
                        type="button"
                        onClick={() => setCheckoutStep("cart")}
                        className="text-xs font-bold text-brand-green hover:underline flex items-center space-x-1 mb-2"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Quay lại giỏ hàng</span>
                      </button>

                      <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Thông tin nhận hàng</h4>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500">Tên người nhận *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.name}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                          placeholder="Nguyễn Thị B"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-green focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500">Số điện thoại *</label>
                        <input
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                          placeholder="0912xxxxxx"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-green focus:bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500">Địa chỉ cụ thể *</label>
                        <textarea
                          required
                          rows={2}
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                          placeholder="Số nhà, ngõ/đường, xã/phường, quận/huyện, tỉnh thành..."
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-green focus:bg-white resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500">Ghi chú thêm (Không bắt buộc)</label>
                        <input
                          type="text"
                          value={shippingInfo.notes}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, notes: e.target.value })}
                          placeholder="Giao giờ hành chính, hộp quà bọc nơ..."
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-green focus:bg-white"
                        />
                      </div>

                      {/* Cost Summary Inside Form */}
                      <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs">
                        <div className="flex justify-between text-neutral-500">
                          <span>Tiền hàng</span>
                          <span>{cartSubtotal.toLocaleString("vi-VN")}đ</span>
                        </div>
                        <div className="flex justify-between text-neutral-500">
                          <span>Phí vận chuyển</span>
                          <span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}đ`}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-brand-dark pt-1 border-t border-neutral-50">
                          <span>Tổng cộng thanh toán</span>
                          <span className="text-brand-accent text-base">{cartTotal.toLocaleString("vi-VN")}đ</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-4 py-3 bg-brand-green hover:bg-brand-green-dark text-white rounded-full font-bold transition-colors shadow-md flex items-center justify-center space-x-1.5"
                        id="shipping-submit-btn"
                      >
                        <Check className="w-5 h-5" />
                        <span>Xác nhận đặt hàng</span>
                      </button>
                    </motion.form>
                  ) : cart.length === 0 ? (
                    /* Empty cart state */
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12"
                      id="cart-empty-panel"
                    >
                      <ShoppingCart className="w-16 h-16 text-neutral-200" />
                      <p className="text-sm font-semibold text-neutral-500">Giỏ hàng của bạn đang trống</p>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          scrollTo(sectionsRef.products);
                        }}
                        className="text-xs font-bold text-brand-green hover:underline"
                      >
                        Tiếp tục khám phá sản phẩm
                      </button>
                    </motion.div>
                  ) : (
                    /* List Cart Items */
                    <motion.div
                      key="items"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                      id="cart-items-panel"
                    >
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-4 bg-neutral-50 p-3 rounded-xl border border-neutral-100"
                        >
                          {/* Mini image */}
                          <div className="w-16 h-16 bg-neutral-200 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          
                          {/* Text/Price info */}
                          <div className="flex-grow space-y-1">
                            <h5 className="text-xs font-bold text-brand-dark line-clamp-1">{item.product.name}</h5>
                            <p className="text-xs font-semibold text-brand-green-dark">
                              {item.product.price.toLocaleString("vi-VN")}đ
                            </p>
                            
                            {/* Quantity buttons row */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, -1)}
                                className="p-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md text-neutral-500"
                                id={`cart-qty-minus-${item.product.id}`}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-brand-dark px-1">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, 1)}
                                className="p-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-md text-neutral-500"
                                id={`cart-qty-plus-${item.product.id}`}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Delete item */}
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-neutral-400 hover:text-brand-accent p-1.5 rounded-full hover:bg-neutral-100 shrink-0"
                            title="Xóa sản phẩm"
                            id={`cart-delete-${item.product.id}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Drawer Footer cost controls */}
              {cart.length > 0 && checkoutStep === "cart" && (
                <div className="p-5 border-t border-neutral-100 bg-neutral-50 space-y-4 shrink-0">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Tổng tiền hàng:</span>
                      <span>{cartSubtotal.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>Phí giao hàng:</span>
                      <span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}đ`}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-brand-dark pt-1.5 border-t border-neutral-200">
                      <span>Tạm tính:</span>
                      <span className="text-brand-accent text-base">{cartTotal.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setCheckoutStep("form")}
                    className="w-full py-3 bg-brand-green hover:bg-brand-green-dark text-white rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base flex items-center justify-center space-x-1.5"
                    id="cart-checkout-btn"
                  >
                    <span>Tiến hành thanh toán</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 13. Back to Top Floating Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-30 p-3.5 bg-brand-green text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            title="Cuộn lên đầu trang"
            aria-label="Cuộn lên đầu trang"
            id="back-to-top-btn"
          >
            <ArrowUp className="w-5.5 h-5.5 transition-transform group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
