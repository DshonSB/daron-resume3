import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Award, Code, Zap, Globe, Users } from 'lucide-react';

const ParticleSystem = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const connections = [];
    let time = 0;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create floating geometric particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.6 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        type: Math.floor(Math.random() * 4), // 0: circle, 1: square, 2: triangle, 3: diamond
        pulseOffset: Math.random() * Math.PI * 2,
        color: Math.random() > 0.7 ? 'slate-400' : 'slate-500'
      });
    }
    
    const drawShape = (ctx, particle) => {
      const pulse = Math.sin(time * 0.003 + particle.pulseOffset) * 0.3 + 1;
      const size = particle.size * pulse;
      const opacity = particle.opacity * (0.7 + pulse * 0.3);
      
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      const colorMap = {
        'slate-400': `rgba(148, 163, 184, ${opacity})`,
        'slate-500': `rgba(100, 116, 139, ${opacity})`
      };
      
      ctx.fillStyle = colorMap[particle.color];
      ctx.strokeStyle = colorMap[particle.color];
      ctx.lineWidth = 1;
      
      switch(particle.type) {
        case 0: // Circle
          ctx.beginPath();
          ctx.arc(0, 0, size, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 1: // Square
          ctx.fillRect(-size, -size, size * 2, size * 2);
          ctx.strokeRect(-size, -size, size * 2, size * 2);
          break;
        case 2: // Triangle
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(-size, size);
          ctx.lineTo(size, size);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case 3: // Diamond
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size, 0);
          ctx.lineTo(0, size);
          ctx.lineTo(-size, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
      }
      
      ctx.restore();
    };
    
    const drawConnections = () => {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const opacity = (150 - distance) / 150 * 0.2;
            ctx.strokeStyle = `rgba(148, 163, 184, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    const animate = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections first (behind particles)
      drawConnections();
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        
        // Bounce off edges with some randomness
        if (particle.x < -20) {
          particle.x = canvas.width + 20;
          particle.vy += (Math.random() - 0.5) * 0.1;
        }
        if (particle.x > canvas.width + 20) {
          particle.x = -20;
          particle.vy += (Math.random() - 0.5) * 0.1;
        }
        if (particle.y < -20) {
          particle.y = canvas.height + 20;
          particle.vx += (Math.random() - 0.5) * 0.1;
        }
        if (particle.y > canvas.height + 20) {
          particle.y = -20;
          particle.vx += (Math.random() - 0.5) * 0.1;
        }
        
        // Add slight drift to movement
        particle.vx += (Math.random() - 0.5) * 0.002;
        particle.vy += (Math.random() - 0.5) * 0.002;
        
        // Limit velocity
        const maxVel = 1.2;
        if (Math.abs(particle.vx) > maxVel) particle.vx = particle.vx > 0 ? maxVel : -maxVel;
        if (Math.abs(particle.vy) > maxVel) particle.vy = particle.vy > 0 ? maxVel : -maxVel;
        
        drawShape(ctx, particle);
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setProgress(currentProgress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
      <div 
        className="h-full bg-gradient-to-r from-slate-400 to-slate-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [delay]);
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const GlowCard = ({ children, className = "", delay = 0 }) => {
  return (
    <AnimatedSection delay={delay}>
      <div className={`relative group ${className}`}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-400 to-slate-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
          {children}
        </div>
      </div>
    </AnimatedSection>
  );
};

const FloatingIcon = ({ Icon, className = "" }) => {
  return (
    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 border border-slate-600 shadow-lg animate-pulse ${className}`}>
      <Icon className="w-6 h-6 text-slate-400" />
    </div>
  );
};

const SkillBadge = ({ skill, delay = 0 }) => {
  return (
    <AnimatedSection delay={delay}>
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-600/50 text-slate-300 text-sm font-medium hover:text-white transition-colors duration-300">
          {skill}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default function ModernResume() {
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const experience = [
    {
      period: "Mar 2020 — Present",
      company: "Life & Annuity Masters",
      role: "Marketing Consultant",
      achievements: [
        "Created marketing campaigns for both the internal agency and external clients, including e-mail and digital campaigns",
        "Led backend support on company website re-design which included updating copy, imagery and added SSO for partners to access individualized information",
        "Assisted in the design and production of professional high-level marketing presentations and supporting materials",
        "Encouraged sales and marketing relationships with partner agencies",
        "Developed and maintained prospective case status reports to regularly brief firm principals",
        "Organized and coordinated RFPs for corporate clients",
        "Identified and assisted principals with cross-selling opportunities within each client",
        "Developed new business by recruiting new agents and growing existing agent groups to maximize revenue potential",
        "Assisted with life insurance illustrations, product analysis and technical case design"
      ]
    },
    {
      period: "Apr 2017 — Mar 2020",
      company: "FFP Insurance Services",
      role: "Marketing Specialist",
      location: "Santa Clarita",
      achievements: [
        "Developed new business by recruiting new agents and growing existing agent groups to maximize revenue potential",
        "Successfully built and managed relationships with key producers to discuss sales concepts, marketing campaigns, and product information",
        "Improved customer and prospect campaign delivery to achieve personalized targeting, optimized delivery and enhanced reporting",
        "Maintained and grew an individual sales revenue goal and enhanced team sales goals",
        "Proactively called assigned agents to build block of business on a daily basis",
        "Coordinated and executed local marketing efforts and communications",
        "Encouraged sales and marketing relationships with partner agencies",
        "Trained agencies in areas of sales techniques, release of new products and agent recruiting",
        "Promoted agency events via marketing campaigns and distributions channels"
      ]
    },
    {
      period: "Mar 2015 — Apr 2017",
      company: "Farmers Insurance Group",
      role: "Producer",
      achievements: [
        "Led prospecting, networking, and producing efforts of new Property and Casualty business insurance policies and accounts",
        "Solicited and quoted new business: Commercial Business and Health Insurance",
        "Responsible for renewal and retention of existing accounts"
      ]
    },
    {
      period: "Apr 2012 — Mar 2015",
      company: "360 Agency",
      role: "Digital Coordinator",
      achievements: [
        "Daily management and monitoring of agency's primary accounts which included drafting and creating original content for clients' social media platforms",
        "Established budgets, schedules and benchmarks for online campaigns as well as live events",
        "Worked to create comprehensive action plans that incorporated noted social media channels to drive targeted viewership",
        "Developed strategies, tactics and editorial calendars to support client priorities - including research, writing, and scheduling"
      ]
    }
  ];
  
  const skills = [
    "Customer Service", "Business Development", "Knowledge of Campaigns", "Marketing",
    "Business Marketing", "Advertising Campaigns", "Product Information Management", "Sales Concepts",
    "Generation of Leads", "Target Market Selection", "General Insurance", "Insurance Management and Aftercare",
    "Employee Retention", "Networking Skills", "Customer Relationship Management", "Social Media", 
    "Event Management", "Business to Business Commerce", "Corporate Clients", "HubSpot", 
    "Presentations", "Salesforce.Com", "Brand Management", "Direct Marketing", "Mailchimp",
    "Social Marketing", "Squarespace", "Wix", "WordPress", "Annuity Investments", 
    "Knowledge of Finance", "Backend", "GitHub", "Adobe"
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      <ParticleSystem />
      <ScrollProgress />
      
      {/* Mouse follower */}
      <div 
        className="fixed w-6 h-6 bg-slate-400/20 rounded-full pointer-events-none z-30 transition-all duration-100 ease-out"
        style={{
          left: mousePos.x - 12,
          top: mousePos.y - 12,
          transform: `scale(${mousePos.x > 0 ? 1 : 0})`
        }}
      />
      
      {/* Navigation */}
      <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700/50 px-8 py-4">
          <div className="flex space-x-8">
            {['Profile', 'Experience', 'Skills', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-slate-300 hover:text-white transition-colors duration-300 font-medium"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-8">
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <AnimatedSection>
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full blur-lg opacity-60 animate-pulse"></div>
                <div className="relative w-full h-full bg-slate-800 rounded-full border-4 border-slate-600 flex items-center justify-center">
                  <span className="text-4xl font-bold text-slate-300">DO</span>
                </div>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
                Daron O'Brien
              </h1>
              <div className="text-2xl md:text-3xl text-slate-400 mb-8 font-light">
                Marketing Specialist & Business Development Expert
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={300}>
            <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-12">
              Dynamic Marketing Consultant with over 7 years of experience driving business growth 
              and enhancing marketing strategies across multiple sectors. Passionate about creating 
              impactful marketing solutions that resonate with diverse audiences.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={600}>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center space-x-2 bg-slate-800/60 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-600/50">
                <MapPin className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300">San Pedro</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/60 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-600/50">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300">dshonobrien@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/60 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-600/50">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300">323.270.9810</span>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={900}>
            <button
              onClick={() => scrollToSection('experience')}
              className="group inline-flex items-center space-x-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <span className="font-semibold">Explore My Journey</span>
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
            </button>
          </AnimatedSection>
        </div>
        
        {/* Floating icons */}
        <div className="absolute top-1/4 left-1/4 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <FloatingIcon Icon={Briefcase} />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <FloatingIcon Icon={Globe} />
        </div>
        <div className="absolute bottom-1/3 left-1/6 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>
          <FloatingIcon Icon={Users} />
        </div>
      </section>
      
      {/* Experience Section */}
      <section id="experience" className="py-32 px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
                Professional Experience
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-slate-400 to-slate-600 mx-auto rounded-full"></div>
            </div>
          </AnimatedSection>
          
          <div className="space-y-12">
            {experience.map((job, index) => (
              <GlowCard key={index} delay={index * 200}>
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="md:col-span-1">
                    <div className="flex items-center space-x-2 mb-4">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-300 font-medium">{job.period}</span>
                    </div>
                    {job.location && (
                      <div className="flex items-center space-x-2 text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:col-span-3">
                    <h3 className="text-2xl font-bold text-white mb-2">{job.role}</h3>
                    <h4 className="text-xl text-slate-300 mb-6">{job.company}</h4>
                    
                    <div className="space-y-3">
                      {job.achievements.map((achievement, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-slate-300 leading-relaxed">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section id="skills" className="py-32 px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
                Skills & Expertise
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-slate-400 to-slate-600 mx-auto rounded-full"></div>
            </div>
          </AnimatedSection>
          
          <GlowCard>
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <Award className="w-6 h-6 mr-3 text-slate-400" />
                  Marketing & Sales
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.slice(0, 12).map((skill, index) => (
                    <SkillBadge key={index} skill={skill} delay={index * 50} />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-slate-400" />
                  Business & Insurance
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.slice(12, 22).map((skill, index) => (
                    <SkillBadge key={index} skill={skill} delay={index * 50 + 300} />
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <Code className="w-6 h-6 mr-3 text-slate-400" />
                  Technical Platforms
                </h3>
                <div className="flex flex-wrap gap-3">
                  {skills.slice(22).map((skill, index) => (
                    <SkillBadge key={index} skill={skill} delay={index * 50 + 600} />
                  ))}
                </div>
              </div>
            </div>
          </GlowCard>
        </div>
      </section>
      
      {/* Education Section */}
      <section className="py-32 px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
                Education
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-slate-400 to-slate-600 mx-auto rounded-full"></div>
            </div>
          </AnimatedSection>
          
          <GlowCard>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-800 rounded-full border-2 border-slate-600 flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">Bachelor of Arts in Communication</h3>
              <p className="text-xl text-slate-300 mb-4">University of California, Santa Barbara</p>
              <p className="text-slate-400 mb-6">June 2008 — June 2012</p>
              
              <div className="mt-8 pt-8 border-t border-slate-700/50">
                <h4 className="text-lg font-semibold text-slate-300 mb-4">Languages</h4>
                <div className="flex justify-center">
                  <div className="bg-slate-800/60 backdrop-blur-sm px-6 py-2 rounded-full border border-slate-600/50 text-slate-300">
                    English (Native)
                  </div>
                </div>
              </div>
            </div>
          </GlowCard>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-32 px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
              Let's Connect
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-slate-400 to-slate-600 mx-auto rounded-full mb-12"></div>
          </AnimatedSection>
          
          <AnimatedSection delay={300}>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Ready to elevate your marketing strategy? Let's discuss how we can drive growth 
              and create impactful solutions together.
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            <GlowCard delay={200}>
              <div className="text-center">
                <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
                <p className="text-slate-300">dshonobrien@gmail.com</p>
              </div>
            </GlowCard>
            
            <GlowCard delay={400}>
              <div className="text-center">
                <Phone className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Phone</h3>
                <p className="text-slate-300">323.270.9810</p>
              </div>
            </GlowCard>
            
            <GlowCard delay={600}>
              <div className="text-center">
                <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Location</h3>
                <p className="text-slate-300">San Pedro, CA</p>
              </div>
            </GlowCard>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-8 border-t border-slate-700/50 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">
            © 2024 Daron O'Brien. Crafted with passion for exceptional marketing solutions.
          </p>
        </div>
      </footer>
    </div>
  );
}