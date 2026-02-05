import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Container,
  Button,
  Pagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { FaTiktok } from "react-icons/fa";

// Import all image assets
import zido from "../../assets/zido.jpeg";
import mutiu from "../../assets/mutiu.jpeg";
import chizzy from "../../assets/chizzy.jpeg";
import sopchizzy from "../../assets/sopchizzy.jpeg";
import ezeke from "../../assets/ezeke.jpeg";
import movich from "../../assets/movic.jpeg";
import ogoo from "../../assets/ogoo.jpeg";
import judith from "../../assets/judith.jpeg";
import henry from "../../assets/henry.jpeg";
import destiny from "../../assets/dsetiny.jpeg";
import dodo from "../../assets/dodo.jpeg";
import esomchi from "../../assets/esomchi.jpeg";
import kosi from "../../assets/kosi.jpeg";
import nnaemmy from "../../assets/nnaemmy.jpeg";

const BusinessCard = () => {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const cardsPerPage = isSmallScreen ? 50 : 100;

  const businesses = [
    {
      id: 1,
      name: "Nurse  Chibuzor Madu",
      description:
        "I AM A PURPOSE DRIVEN PERSONALITY WHO BELIEVES IN TEAM WORK, DEDICATION AND COMMITMENT IN ACHIEVING ANY SET GOALS. AM ALSO A SEASONED LEADER ",
      owner: "Nurse  Chibuzor Madu",
      image: zido,
      services: [
        "Registered Nurse",
        "Medical, Psychological and Health Consultancy",
      ],
      phone: ": +2348109405836",
      email: "chibuzormadu286@yahoo.com",
      facebook: "https://www.facebook.com/chibuzor.madu.289631",
      whatsapp: "08060549172",
      part: "Tenor",
    },
    {
      id: 2,
      name: "Mutiu Software Solutions",
      description:
        "i'm a passionate and results-driven full-stack web developer with a strong background in building dynamic, responsive, and user-friendly websites. With expertise in both frontend and backend technologies, I craft seamless digital experiences from concept to deployment. Specializing in tools like React, Node.js, Express, MongoDB, and Material-UI, I build applications that are not only visually appealing but also powerful under the hood. I am committed to clean code, scalable architecture, and delivering real-world solutions that solve problems and add value. Whether it's developing user interfaces, implementing RESTful APIs, integrating payment systems like Paystack, or managing authentication and database operations, I bring dedication, creativity, and technical excellence to every project. In addition to software development, I am also actively involved in real estate offering trusted services in property sourcing, buying, and selling.",
      owner: " Chibueze Emmanuel Madu (Mutiu Software Solutions)",
      image: mutiu,
      services: [
        "Full-stack web development",
        "Frontend development (React, Material-UI, HTML, CSS, JavaScript, TypeScript, Bootstrap, Tailwind CSS, )",
        "Backend development (Node.js, Express)",
        "Database management (MongoDB)",
        "RESTful API development",
        "Authentication and authorization",
        "Payment integration (Paystack, Stripe, Flutterwave, etc.)",
        "Web application architecture",
        "Responsive web design and development",
        "User experience (UX) design",
        "Web application deployment",
        "Website maintenance and support",
        "E-commerce solutions",
        "Mobile-friendly design",
        "Web Design",
        "Real Estate",
      ],
      phone: "+2347031911306",
      email: "chidiemmamadu@gmail.com",
      facebook: "https://m.facebook.com/emmanuelmutiu",
      whatsapp: "+2347031911306",
      part: "Bass",
    },
    {
      id: 3,
      name: " David Chibuzor Amaogu, aka Macdavid Computers(Ezege 1) ",
      description:
        "I am a passionate and versatile IT consultant with a strong background in both hardware and software support, offering practical solutions to everyday tech challenges. My expertise spans the sales and repair of laptops and essential accessories, ensuring clients get the best value and reliable service.Beyond technology, I am a gifted instrumentalist—proficient in playing the harmonica, konga, and piano. As a tenor singer with a flair for performance, I bring life to any gathering through music and rhythm, often pairing my sound with strategic dance expressions that captivate audiences. As a charismatic Master of Ceremonies (MC), I anchor events such as weddings, birthdays, and memorials with professionalism, humor, and presence ensuring that every moment remains unforgettable. Nicknamed (The Philosopher,) I am deeply curious about life, constantly in pursuit of truth, knowledge, and wisdom. This mindset also fuels my recent journey into the financial world, where I’m a new but enthusiastic learner in forex and cryptocurrency trading.Currently, I am expanding my skills in data analysis, driven by a desire to harness data for insights, storytelling, and decision-making in today's digital economy.Whether it's through technology, art, finance, or through leadership I bring creativity, depth, and a learner’s spirit to every endeavor.",
      owner: "  David Chibuzor Amaogu",
      image: ezeke,
      services: [
        "IT consultancy (hardware and software)",
        "Laptop sales and repairs",
        "Laptop accessories supply",
        "Musical performance (Harmonica, Konga, Piano)",
        "Tenor vocal performance",
        "Strategic dance entertainment",
        "Master of Ceremonies (weddings, birthdays, burials, etc.)",
        "Philosophical content creation / motivational speaking",
        "Forex and cryptocurrency trading (beginner level)",
        "Data analysis (learning stage)",
      ],
      phone: "   +2348108002904",
      email: " davidamaogu042@gmail.com",
      whatsapp: "   +2348108002904",
      part: "Tenor",
    },
    {
      id: 4,
      name: "Comrd  Ozioma Miracle Christian",
      description:
        "Located at Mechanic Village, Umudagu Mbieri, we are a trusted team committed to excellence in service delivery. With a strong belief in our motto “God is Able”, we bring creativity, professionalism, and reliability to every project we handle. From transforming spaces with vibrant designs to delivering unforgettable event experiences, we pride ourselves on meeting your needs with quality and care.",
      owner: "OZZYMOORE SERVICES  ",
      image: movich,
      services: [
        "Event Planning",
        "Installation of All Kinds of Lights",
        "Painting (Interior & Exterior Design)",
        "Real Estate Services",
        "Land and Property Sales",
        "House Rental and Purchase Assistance",
        "Alumaco Works",
        "Catering & Event Services",
        "Ushering Services",
      ],
      phone: "     +2347039058702",
      email: " miracleozioma2789@gmail.com",
      whatsapp: "+2348062835639",
      part: "Bass",
    },
    {
      id: 5,
      name: "Chiziterem MariaGoretti Ibenyenwa.",
      description:
        "I am a proud native of Umuogidiugo Ubah Emii, Owerri North LGA. Currently, I am pursuing my studies in Nursing at Imo State University (IMSU), while also building my passion as an entrepreneur. Alongside my academics, I run a thriving online business where I provide quality and affordable fashion items, surprise decorations of any kind, and catering services.",
      owner: " Chiziterem MariaGoretti Ibenyenwa",
      image: chizzy,
      services: [
        "sales of fashion items",
        "clothing alterations",
        "fashion consulting",
        "personal shopping",
        "sales of Shoes",
        "sales of Wears (all kinds, both male & female)",
        "sales of Bags",
        "Surprise Decorations",
        "Catering Services",
      ],
      phone: "     +2348105133540",
      whatsapp: " +2348105133540",
      part: "Alto",
    },
    {
      id: 6,
      name: " Catherine  Ogochukwu Ekpe",
      description:
        "My name is Ogochukwu Catherine Ekpe, from Ezinihitte Mbaise LGA, Imo State. I am a passionate fashion designer for ladies with a flair for creativity and elegance. Beyond fashion, I am also a skilled baker, crafting delightful treats that bring joy to every occasion. With dedication and love for my crafts, I strive to inspire confidence and happiness through both style and taste.",
      owner: "KATHY'S STITCHES/BAKERY AND CATERING SERVICES",
      image: ogoo,
      services: [
        "Fashion designer",
        "Bakery and pastry",
        "Event planner",
        "clothing alterations",
        "fashion consulting",
        "personal shopping",
        "Surprise vendor",
        "Wedding / Birthday Decoration.",
        "Catering Services",
      ],
      phone: "     +2349064010705",
      email: " ekpecatherine14@gmail.com",
      facebook: "https://www.facebook.com/share/1AzckAxy24/",
      whatsapp: " +2349064010705",
      part: "Alto",
    },
    {
      id: 7,
      name: " Nzubechi Judith Onuoha    ",
      description:
        "I am a dedicated health worker committed to promoting wellness and making a positive impact in people’s lives. Alongside my profession, I am also a passionate entrepreneur in fabrics, where I specialize in sourcing and providing high-quality materials that combine beauty, durability, and style. My journey blends care for humanity with creativity in fashion, allowing me to serve both in the field of health and in the world of entrepreneurship.",
      owner: "Julenfabrics     ",
      image: judith,
      services: [
        "Health care services consultancy",
        "clothing alterations",
        "fabric sales",
        "fashion consulting",
        "personal shopping",
      ],
      phone: "   +2348107471739    ",
      email: " Judithsnowy@gmail.com     ",
      whatsapp: "   +2348107471739     ",
      part: "Alto",
    },
    {
      id: 8,
      name: "   Chimezie  Henry Maduako ",
      description:
        "I'm from Umuodiri Umunumo in Umuchoke Autonomous Community  of EHIME MBANO Imo State, I'm a Public Health Specialist, I Attend to any  Public health Issues, ranging from HIV/AIDS, Tuberculosis,Mariaria, STIs, STDs and many more, A public health Advocate, I'm a baker  an Event Planner of over 7 years now ",
      owner: "DfansCakes and Pastries.     ",
      image: henry,
      services: [
        " Public Health,    ",
        "Baking and Pastries",
        "Event Planning",
        "surprise Packages pastries",
        "paint production",
        "liquid soap production",
        "bleach production",
        "Disinfectant Production",
      ],
      phone: "     +2347030431622        ",
      email: "  raphenry55@gmail.com   ",
      facebook: "https://www.facebook.com/share/1B1Ju8AX7N/",
      whatsapp: "     +2347030431622  ",
      instagram:
        "https://www.instagram.com/henry_maduako?igsh=NGVobWpwbW90cTV4",
      tiktok: "https://www.tiktok.com/@fantastichenry23",
      part: "Alto",
    },
    {
      id: 9,
      name: "  Chizoba Chibuike  ",
      description:
        "A registered nurse and multi-faceted model with passion for healthcare, fashion, and personal development. ",
      owner: "Nurse Chizoba Chibuike     ",
      image: destiny,
      services: [
        " Nursing / health consultancy,    ",
        "Modeling (fashion, commercial, lifestyle, etc.)",
      ],
      phone: "     +2348156817318        ",
      email: "  Chizobasixtus31@gmail.com   ",
      // facebook: "https://www.facebook.com/share/1B1Ju8AX7N/",
      whatsapp: "     +23408156817318  ",
      // instagram:
      //   "https://www.instagram.com/henry_maduako?igsh=NGVobWpwbW90cTV4",
      // tiktok: "https://www.tiktok.com/@fantastichenry23",
      part: "Soprano",
    },
    {
      id: 10,
      name: "Chizzy Ukadiala",
      description:
        "I believe in making a lasting impression everywhere I go. For me, confidence begins with looking good, feeling good, and most importantly smelling good. I live by the mantra: “Do not spare any effort to smell good today; go all out for it because you deserve to smell nice.”Driven by passion and excellence, I combine style, elegance, and self-care to help others embrace the best version of themselves. My goal is to inspire people to live boldly, feel beautiful, and carry an aura that speaks even before words are exchanged.",
      owner: "Zee perfumery",
      image: sopchizzy,
      services: [
        " Perfume Consultation & Sales – discover fragrances that match your personality and lifestyle.   ",
        "Fashion Styling – helping you dress with confidence for every occasion.",
        "Beauty & Personal Care – tips and curated products to enhance your everyday look.",
        "Luxury Gift Packages – perfumes, fashion, and accessories arranged with elegance.",
        "Image & Confidence Coaching – guiding you to present your best self.",
      ],
      phone: "+2349165383335",
      email: "   ukadialaconfidence123@gmail.com   ",
      facebook:
        "https://www.facebook.com/chizzy.ukadiala.5?mibextid=wwXIfr&mibextid=wwXIfr",
      whatsapp: "09165383335",
      // instagram:
      //   "https://www.instagram.com/henry_maduako?igsh=NGVobWpwbW90cTV4",
      // tiktok: "https://www.tiktok.com/@fantastichenry23",
      part: "Soprano",
    },
    {
      id: 11,
      name: "  EMMANUEL IFEANYI OGBONNA",
      description:
        "I am a native of Umuagwu Irete, Owerri West LGA, Imo StateA graduate of Accounting from Imo State University, Owerri, and a holder of a Master’s Degree in Accounting from the University of Port Harcourt, Choba, Rivers State.With over 8 years of professional experience in Accounting, Internal Audit/Control, and Finance, I bring a wealth of knowledge and expertise to every task I undertake. As a certified QHSE personnel, I uphold the highest standards of quality, health, safety, and environmental practices in my work.My career aspiration is to reach the very peak of the Finance profession, constantly motivated to improve, grow, and become a better version of myself each day.Beyond my professional career, I am also engaged in entrepreneurship, actively involved in the transportation business as well as offering Internal Audit and Control consultations.",
      owner: " EMMANUEL IFEANYI OGBONNA",
      image: dodo,
      services: [
        " transportation services (East to the West and Abuja),  ",
        "Internal Audit & Control Consultation",
        "Financial Management & Advisory Services",
        "Accounting Services",
        "Business Consultancy",
        "Transportation Services",
        "Business Consultation",
      ],
      phone: "+2347037211275",
      email: "   wisdom4brains@yahoo.com   ",
      facebook: "https://www.facebook.com/share/1Bg14JccnD/",
      whatsapp: "+2347037211275",
      instagram: "https://www.instagram.com/acfeco?igsh=dWRvMjFobGk3eWk3",
      // tiktok: "https://www.tiktok.com/@fantastichenry23",
      part: "Bass",
    },
    {
      id: 12,
      name: " Esomchi Rita Nwagha",
      description:
        "My name is Nwagha Esomchi Rita A content creator/actress,A realtor, Event caterer/VisionaryShe’s a passionate and purpose driven professional with a dynamic career in real estate, content creation and small scale event catering. A proud graduate of Imo State University Owerri, she holds a Bachelor’s degree in History and International Studies, complemented by certifications in Health Safety Environment(HSE) Levels 1,2 and 3. With a natural flair for communication and a deep understanding of human connection, Rita has built a reputation for excellence, integrity and creativity in every endeavor she undertakes. Whether helping clients to find their dream homes or crafting memorable experiences through her catering services, she approaches task with dedication and empathy and an eye for detail.Her dynamic career spans multiple industries- from helping clients secure their ideal homes as a dedicated realtor, to captivating audiences as content creator and actress, to delivering memorable moments through her small-scale event catering services. With each role, Rita brings a unique blend of creativity, discipline and a deep sense of purpose.Beyond her professional pursuit, Rita is a traveler, a singer and speaker who finds joy in exploring new cultures, sharing her voice, and inspiring others. Her personal philosophy reflects her unwavering optimism and faith: “I believe there’s a God, but I don’t believe he’s a God of poverty”  this believe fuels her drive to break boundaries and uplift others, and live a life of purpose and abundance.Rita continues to evolve, learn and lead- proving that with faith, vision and hard work, anything is possible.",
      owner: "Ritstraunt Services",
      image: esomchi,
      services: [
        " Real Estate Consultant  ",
        "Health Safety Officer (HSE) Levels 1,2 and 3",
        "Content Creation/Actress",
        "Small Scale Event Catering",
        "Travel Enthusiast",
        "Singer and Speaker",
        "Small event caterer ",
        "Accounting Services",
        "Business Consultancy",
        "Transportation Services",
        "Business Consultation",
      ],
      phone: "+2347065178656",
      email: " ritaesomchi99@gmail.com",
      facebook: "https://www.facebook.com/share/1FpRiTx6K4/?mibextid=wwXIfr",
      whatsapp: "+2347065178656",
      instagram:
        "https://www.instagram.com/officialritariri?igsh=MTJxZnhsZmg3cXQ5ZQ%3D%3D&utm_source=qr",
      tiktok:
        "https://www.tiktok.com/@ritariri77?_r=1&_d=eihb2akaf2fim1&sec_uid=MS4wLjABAAAA0rHJoODLBYwiJYhjffQmhTrIpiwGVkR1m315MMAgBztaWfXhLdtcqoJim4CKUqm1&share_author_id=7364274075608351749&sharer_language=en&source=h5_m&u_code=ee104350j5fgf0&item_author_type=1&utm_source=copy&tt_from=copy&enable_checksum=1&utm_medium=ios&share_link_id=18116A92-93B5-43EB-8564-5560BFE837BE&user_id=7364274075608351749&sec_user_id=MS4wLjABAAAA0rHJoODLBYwiJYhjffQmhTrIpiwGVkR1m315MMAgBztaWfXhLdtcqoJim4CKUqm1&social_share_type=5&ug_btm=b8727,b0&utm_campaign=client_share&share_app_id=1233",
      part: "Soprano",
    },
    {
      id: 13,
      name: " Kosisochukwu Maryann Nnadi",
      description:
        "Driven by curiosity and inspired by creativity, I am passionate about enhancing beauty, exploring discoveries, and crafting meaningful stories. With a unique blend of science and artistry, I thrive at the intersection of innovation and self-expression. As a Scientist, Nail Technician, Content Creator, and Makeup Artist, I channel both precision and imagination into everything I do whether it’s creating flawless looks, producing engaging  content, or exploring new ideas that inspire and transform. My mission is to inspire confidence, celebrate individuality, and bring visions to life through creativity.",
      owner: "Kosi's Glam",
      image: kosi,
      services: [
        " Professional Nail Care & Artistry ",
        "Makeup for all occasions (Bridal, Editorial, Events)",
        "Skincare & Personal Grooming Guidance",
        "Engaging Content Creation (Video, Social Media, Lifestyle)",
        "Storytelling & Creative Direction",
        "Curiosity-driven exploration and creative problem-solving",
        "Sharing insights that bridge science, beauty, and creativity",
        "Inspiring confidence and self-expression through artistry",
      ],
      phone: "+2349045279216",
      email: " kosisochukwunnadi95@gmail.com",
      facebook: "https://www.facebook.com/share/1FJs6BFoj2/",
      whatsapp: "+2348072125172",
      // instagram:
      //   "https://www.instagram.com/officialritariri?igsh=MTJxZnhsZmg3cXQ5ZQ%3D%3D&utm_source=qr",
      // tiktok:
      //   "https://www.tiktok.com/@ritariri77?_r=1&_d=eihb2akaf2fim1&sec_uid=MS4wLjABAAAA0rHJoODLBYwiJYhjffQmhTrIpiwGVkR1m315MMAgBztaWfXhLdtcqoJim4CKUqm1&share_author_id=7364274075608351749&sharer_language=en&source=h5_m&u_code=ee104350j5fgf0&item_author_type=1&utm_source=copy&tt_from=copy&enable_checksum=1&utm_medium=ios&share_link_id=18116A92-93B5-43EB-8564-5560BFE837BE&user_id=7364274075608351749&sec_user_id=MS4wLjABAAAA0rHJoODLBYwiJYhjffQmhTrIpiwGVkR1m315MMAgBztaWfXhLdtcqoJim4CKUqm1&social_share_type=5&ug_btm=b8727,b0&utm_campaign=client_share&share_app_id=1233",
      part: "Alto",
    },
    {
      id: 14,
      name: "Emeka Uzor",
      description:
        " A native of Agwa in Oguta, is a highly motivated individual with skill set, knowledge, and expertise that cuts across different domains, but particularly health. He is a Clinical Optometrist with over 10 years of experience, CEO of Bio360 Diagnostics located on the Lagos Mainland, a commercial farmer majoring in staple crops, and a creative and academic writer. When he's not managing his businesses or writing an essay, Emeka can be found reading a book with a cold bottle of Guinness by his side.",
      owner: "Emeka Uzor",
      image: nnaemmy,
      services: [
        " Eye care",
        " Optometry services",
        "Medical laboratory services",
        "Diagnostics",
        "Agriculture",
        "Farming",
        "Creative writing",
        "Academic writing",
        "Leadership.",
        "Entrepreneurship.",
      ],
      phone: " +2348134314428",
      email: " Bio360diagnostics@gmail.com",
      // facebook: "https://www.facebook.com/share/1FJs6BFoj2/",
      whatsapp: " +2348134314428",
      // instagram:
      //   "https://www.instagram.com/officialritariri?igsh=MTJxZnhsZmg3cXQ5ZQ%3D%3D&utm_source=qr",
      tiktok: " https://vt.tiktok.com/ZSDaMu3eM/",
      part: "Bass",
    },
  ];

  const filteredBusinesses = businesses.filter((biz) =>
    biz.services.some((service) =>
      service.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredBusinesses.length / cardsPerPage);
  const paginatedBusinesses = filteredBusinesses.slice(
    (page - 1) * cardsPerPage,
    page * cardsPerPage
  );

  const toggleReadMore = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  // ✅ Function to clean phone numbers for WhatsApp links
  const formatWhatsAppNumber = (num) => {
    if (!num) return "";
    return num.replace(/\D/g, ""); // keep only digits
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="center" mb={4}>
        <TextField
          label="Search by Service"
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ width: "100%", maxWidth: 400 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {paginatedBusinesses.length > 0 ? (
          paginatedBusinesses.map((business) => {
            const isExpanded = expandedId === business.id;
            const shortText = business.description.length < 120;
            const cleanWhatsApp = formatWhatsAppNumber(business.whatsapp);

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={business.id}>
                <Card
                  sx={{
                    maxWidth: 345,
                    mx: "auto",
                    height: "100%",
                    minHeight: 520,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: 3,
                  }}
                >
                  <CardMedia
                    component="img"
                    height="350"
                    image={business.image}
                    alt={business.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {business.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: isExpanded ? "none" : 3,
                      }}
                    >
                      {business.description}
                    </Typography>
                    {!shortText && (
                      <Button
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => toggleReadMore(business.id)}
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </Button>
                    )}

                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Services:
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                      >
                        {business.services.map((service, index) => (
                          <Chip
                            key={index}
                            label={service}
                            size="small"
                            color="error"
                          />
                        ))}
                      </Stack>
                    </Box>

                    <Box mt={2}>
                      <Typography variant="caption" color="text.secondary">
                        Owner: {business.owner}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        Part: {business.part}
                      </Typography>
                      {business.phone && (
                        <Typography variant="caption" color="text.secondary">
                          <br />
                          Phone:{" "}
                          <a
                            href={`tel:${business.phone}`}
                            style={{ color: "#1976d2", textDecoration: "none" }}
                          >
                            {business.phone}
                          </a>
                        </Typography>
                      )}
                      {business.email && (
                        <Typography variant="caption" color="text.secondary">
                          <br />
                          Email:{" "}
                          <a
                            href={`mailto:${business.email}`}
                            style={{ color: "#1976d2", textDecoration: "none" }}
                          >
                            {business.email}
                          </a>
                        </Typography>
                      )}

                      <Box mt={1} display="flex" gap={2}>
                        {cleanWhatsApp && (
                          <IconButton
                            component="a"
                            href={`https://wa.me/${cleanWhatsApp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="success"
                          >
                            <WhatsAppIcon />
                          </IconButton>
                        )}
                        {business.facebook && (
                          <IconButton
                            component="a"
                            href={business.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="primary"
                          >
                            <FacebookIcon />
                          </IconButton>
                        )}
                        {(business.instagram || business.Instagram) && (
                          <IconButton
                            component="a"
                            href={
                              business.instagram?.startsWith("http")
                                ? business.instagram
                                : `https://instagram.com/${
                                    business.instagram || business.Instagram
                                  }`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            color="secondary"
                          >
                            <InstagramIcon />
                          </IconButton>
                        )}
                        {business.website && (
                          <Typography variant="caption" color="text.secondary">
                            Website:{" "}
                            <a
                              href={
                                business.website.startsWith("http")
                                  ? business.website
                                  : `https://${business.website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#1976d2",
                                textDecoration: "none",
                              }}
                            >
                              {business.website}
                            </a>
                          </Typography>
                        )}
                        {business.tiktok && (
                          <IconButton
                            component="a"
                            href={business.tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: "#000000" }}
                          >
                            <FaTiktok />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: "center", width: "100%", mt: 4 }}
          >
            No businesses found for "{search}"
          </Typography>
        )}
      </Grid>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default BusinessCard;
