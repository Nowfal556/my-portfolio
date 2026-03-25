import { useState, useEffect, useRef, useMemo } from 'react'
import './App.css'
import './index.css'
import profileImage from './assets/b1d52f62-1c9b-48fb-95ff-c5aa7415fa2f.jpeg'

function TypingText({ text, speed = 100 }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return <span>{displayText}<span className="cursor">|</span></span>
}

function App() {
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState('hero')
  const [isLoaded, setIsLoaded] = useState(false)
  const observerRef = useRef(null)

  useEffect(() => {
    setIsLoaded(true)

    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '-50px 0px -50px 0px'
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate')
        }
      })
    }, observerOptions)

    // Observe all animate-on-scroll elements after a short delay
    const timer = setTimeout(() => {
      const animateElements = document.querySelectorAll('.animate-on-scroll')
      animateElements.forEach(el => observerRef.current?.observe(el))
    }, 100)

    return () => {
      clearTimeout(timer)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Update active section
      const sections = ['hero', 'about', 'skills', 'projects', 'blogs', 'contact', 'resume']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="App">
      <nav className="navbar">
        <a href="#hero" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollToSection('hero') }}>
          MN
        </a>
        <ul className="nav-links">
          {[
            { id: 'hero', label: 'Home' },
            { id: 'about', label: 'About' },
            { id: 'skills', label: 'Skills' },
            { id: 'projects', label: 'Projects' },
            { id: 'blogs', label: 'Blogs' },
            { id: 'contact', label: 'Contact' },
            { id: 'resume', label: 'Resume' }
          ].map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeSection === id ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollToSection(id) }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="hero" className="hero">
        <div className="hero-content">
          <img
            src={profileImage}
            alt="Mohamed Nowfal"
            className="profile-img hover-lift"
            loading="lazy"
          />
          <h1>
            <TypingText text="Mohamed Nowfal" speed={120} />
          </h1>
          <div className="typing-text">
            Front End Developer
          </div>
          <p>
            Passionate about creating beautiful, responsive, and performant web experiences
            with modern technologies and clean code practices.
          </p>
          <button
            className="cta-button hover-lift"
            onClick={() => scrollToSection('contact')}
            aria-label="Get in touch"
          >
            Get In Touch
          </button>
        </div>
      </section>

      <section id="about" className="section">
        <div className="section-content animate-on-scroll">
          <h2>About Me</h2>
          <div className="animate-on-scroll animate-left" style={{ animationDelay: '0.2s' }}>
            <p>
              Hi! I'm Mohamed Nowfal, a dedicated front-end developer with advanced knowledge in HTML and CSS.
              I have foundational skills in JavaScript, Java, C++, Python, and I'm currently expanding my expertise
              in software testing and quality assurance.
            </p>
          </div>
          <div className="animate-on-scroll animate-right" style={{ animationDelay: '0.4s' }}>
            <p>
              My passion lies in creating stunning, user-friendly websites that deliver smooth and engaging
              experiences. I'm always eager to learn emerging technologies and tackle challenging projects
              that push the boundaries of web development.
            </p>
          </div>
        </div>
      </section>

      <section id="skills" className="section">
        <div className="section-content animate-on-scroll">
          <h2>My Skills</h2>
          <div className="skills-grid">
            {[
              { icon: '💻', name: 'HTML', level: 'Advanced', percentage: 95 },
              { icon: '🎨', name: 'CSS', level: 'Advanced', percentage: 95 },
              { icon: '⚡', name: 'JavaScript', level: 'Intermediate', percentage: 70 },
              { icon: '⚛️', name: 'React', level: 'Intermediate', percentage: 75 },
              { icon: '☕', name: 'Java', level: 'Basics', percentage: 55 },
              { icon: '⚙️', name: 'C++', level: 'Basics', percentage: 50 },
              { icon: '🐍', name: 'Python', level: 'Basics', percentage: 55 },
              { icon: '🧪', name: 'Software Testing', level: 'Learning', percentage: 45 },
              { icon: '🤖', name: 'AI Tools', level: 'Proficient', percentage: 80 }
            ].map((skill, index) => (
              <div
                key={skill.name}
                className="skill-card hover-lift animate-on-scroll animate-scale"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="skill-icon">{skill.icon}</div>
                <h3>{skill.name}</h3>
                <p>{skill.level}</p>
                <div className="skill-bar">
                  <div
                    className="skill-fill"
                    style={{
                      width: isLoaded ? `${skill.percentage}%` : '0%',
                      transitionDelay: `${0.5 + index * 0.1}s`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="section">
        <div className="section-content animate-on-scroll">
          <h2>My Projects</h2>
          <div className="projects-grid">
            {[
              {
                title: 'Responsive Portfolio Website',
                description: 'A modern, clean portfolio built with React and Vite. Features smooth scrolling, responsive design, and optimized animations for performance.',
                gradient: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                demo: '#',
                github: '#',
                tech: ['React', 'Vite', 'CSS']
              },
              {
                title: 'E-commerce Landing Page',
                description: 'An engaging landing page for online stores, showcasing products with interactive elements and contemporary design principles.',
                gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                demo: '#',
                github: '#',
                tech: ['HTML', 'CSS', 'JavaScript']
              },
              {
                title: 'Weather Application',
                description: 'A functional weather app that retrieves real-time data from APIs and presents current weather conditions with an intuitive interface.',
                gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                demo: '#',
                github: '#',
                tech: ['JavaScript', 'API', 'CSS']
              },
              {
                title: 'Task Management Tool',
                description: 'A productivity app for organizing tasks with drag-and-drop functionality, local storage, and clean user interface.',
                gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                demo: '#',
                github: '#',
                tech: ['React', 'LocalStorage', 'CSS']
              },
              {
                title: 'Calculator App',
                description: 'A sleek calculator application with basic and scientific functions, built with modern web technologies.',
                gradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                demo: '#',
                github: '#',
                tech: ['JavaScript', 'HTML', 'CSS']
              },
              {
                title: 'Blog Platform',
                description: 'A simple blogging platform with markdown support, responsive design, and dynamic content loading.',
                gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
                demo: '#',
                github: '#',
                tech: ['React', 'Markdown', 'CSS']
              }
            ].map((project, index) => (
              <div
                key={project.title}
                className={`project-card hover-lift animate-on-scroll ${index % 2 === 0 ? 'animate-left' : 'animate-right'}`}
                style={{ animationDelay: `${0.2 * index}s` }}
              >
                <div
                  className="project-image"
                  style={{ background: project.gradient }}
                  role="img"
                  aria-label={`${project.title} project preview`}
                ></div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <div className="project-tech">
                    {project.tech.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <p>{project.description}</p>
                  <div className="project-links">
                    <a href={project.demo} className="btn glow-on-hover" target="_blank" rel="noopener noreferrer">
                      <span>🔗</span> Live Demo
                    </a>
                    <a href={project.github} className="btn glow-on-hover" target="_blank" rel="noopener noreferrer">
                      <span>📁</span> GitHub
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="blogs" className="section">
        <div className="section-content animate-on-scroll">
          <h2>My Blogs</h2>
          <div className="animate-on-scroll animate-scale" style={{ animationDelay: '0.2s' }}>
            <p>Coming soon! I'm currently working on sharing my knowledge and experiences in web development.</p>
            <p>Stay tuned for comprehensive articles covering HTML, CSS, JavaScript, React, and emerging web technologies!</p>
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="section-content animate-on-scroll">
          <h2>Contact Me</h2>
          <div className="contact-form animate-on-scroll animate-left" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for your message! I\'ll get back to you soon.') }}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>
              <button type="submit" className="cta-button hover-lift">
                Send Message
              </button>
            </form>
          </div>
          <div className="contact-info animate-on-scroll animate-right" style={{ animationDelay: '0.4s' }}>
            <p>📧 Email: mohamednowfal556@gmail.com</p>
            <p>📱 Phone: +91 8939770027</p>
            <p>💼 Available for freelance projects</p>
          </div>
        </div>
      </section>

      <section id="resume" className="section">
        <div className="section-content animate-on-scroll">
          <h2>My Resume</h2>
          <div className="resume-content animate-on-scroll animate-scale" style={{ animationDelay: '0.2s' }}>
            <p>Download my resume to explore my professional experience, skills, and qualifications in detail.</p>
            <a href="#" className="btn cta-button hover-lift" download>
              <span>📄</span> Download Resume
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
