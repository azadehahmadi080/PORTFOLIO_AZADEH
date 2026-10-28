import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowDownToLine, ArrowUpRight, Github, Linkedin, Menu, X, Globe2, ChevronDown, Sun, Brush, Code2, Server, Clapperboard, Presentation, GraduationCap, BriefcaseBusiness, Target } from 'lucide-react'
import { initialProjects } from './projects.js'

const filters = ['All', 'Website Design', 'App Mobile Design', 'App Desktop']
const roleTitles = ['Full Stack Web Developer', 'UI/UX Designer']
const services = [
  ['UI/UX Design', 'User-first product flows and clear, considered interfaces.'],
  ['Web Design', 'Distinctive responsive websites made to feel effortless.'],
  ['Mobile Design', 'Useful, intuitive mobile experiences from idea to prototype.'],
  ['Visual Identity', 'A cohesive visual language for brands with a point of view.'],
  ['Prototyping', 'Interactive prototypes to test ideas and bring teams together.'],
  ['Art Direction', 'A thoughtful visual direction across every touchpoint.'],
]
const skills = [['JavaScript', 75, 'JS'], ['React', 69, 'Re'], ['Node.js', 80, 'N'], ['Python', 70, 'Py'], ['PostgreSQL', 90, 'Pg']]
const serviceIcons = [Brush, Code2, Server, Clapperboard, Presentation]
const aboutIcons = [GraduationCap, BriefcaseBusiness, Target]
const translations = {
  en: { nav:['Home','Services','About me','Portfolio','Contact me'], hire:'Hire Me', hello:'Hi, I am', roles:['Full Stack Web Developer','UI/UX Designer'], heroIntro:'I’m a creative designer and developer who turns ideas into beautiful, user-friendly digital experiences.', servicesTitle:'Services', servicesIntro:'Thoughtful design to help your ideas find their shape.', services:[['Web Design','Modern, responsive, user-friendly designs using Figma and Adobe XD.'],['Frontend Development','HTML, CSS, JavaScript, Bootstrap, Tailwind CSS, React, and Angular — building interactive web apps.'],['Full Stack Projects','Backend development with Node.js and frontend development with modern frameworks.'],['Video Editing','Promotional videos and reels edited with Adobe tools.'],['Teaching','Experienced teacher in English, computer skills, and digital skills.']], aboutTitle:'About Me', aboutBio:'Originally from Herat, Afghanistan, I’m a Computer Science student at Astana IT University in Kazakhstan. Passionate about technology and problem-solving, I aim to build meaningful software and create opportunities through innovation.', about:[['Education','BSc Computer Science at Astana IT University · expected June 2027.'],['Experience','Built web applications, supported charity digital services, and taught programming.'],['What’s next','Pursue an international master’s in advanced CS and machine learning, then build reliable software that creates opportunities.']], download:'Download CV', portfolioTitle:'Portfolio', portfolioIntro:'A selection of things I’ve been working on.', filters:['All','Website Design','App Mobile Design','App Desktop'], projectTech:'Tech Used', livePreview:'Live Preview', closeProject:'Close project details', projectImageAlt:'Project screenshot', projectPreviewPending:'Project preview coming soon', contactTitle:'Contact me', contactIntro:'Have a project in mind? Let’s make something meaningful.', placeholders:['Name','Email','Phone Number','Service Of Interest','Timeline','Project Details...'], send:'Send', sending:'Sending…', sent:'Thank you — your message has been saved.', error:'Could not send your message. Please try again.', footerNav:['Home','Services','About me','Portfolio','Contact me'], language:'Language', theme:'Black & white mode' },
  fa: { nav:['خانه','خدمات','درباره من','نمونه‌کارها','تماس با من'], hire:'استخدام من', hello:'سلام، من', roles:['توسعه‌دهنده وب فول‌استک','طراح UI/UX'], heroIntro:'طراح و توسعه‌دهنده‌ای خلاق هستم و ایده‌ها را به تجربه‌های دیجیتال زیبا و کاربرپسند تبدیل می‌کنم.', servicesTitle:'خدمات', servicesIntro:'طراحی سنجیده برای جان‌بخشیدن به ایده‌های شما.', services:[['طراحی وب','طراحی‌های مدرن، واکنش‌گرا و کاربرپسند با Figma و Adobe XD.'],['توسعه فرانت‌اند','ساخت وب‌اپلیکیشن‌های تعاملی با HTML، CSS، JavaScript، Bootstrap، Tailwind CSS، React و Angular.'],['پروژه‌های فول‌استک','توسعه بک‌اند با Node.js و فرانت‌اند با فریم‌ورک‌های مدرن.'],['تدوین ویدیو','تدوین ویدیوهای تبلیغاتی و ریلز با ابزارهای Adobe.'],['تدریس','تجربه تدریس زبان انگلیسی، کامپیوتر و مهارت‌های دیجیتال.']], aboutTitle:'درباره من', aboutBio:'من اهل هرات افغانستان هستم و در دانشگاه Astana IT قزاقستان علوم کامپیوتر می‌خوانم. به فناوری و حل مسئله علاقه‌مندم و می‌خواهم با نوآوری نرم‌افزارهای ارزشمند بسازم و فرصت‌های تازه ایجاد کنم.', about:[['تحصیلات','لیسانس علوم کامپیوتر در دانشگاه Astana IT · فراغت مورد انتظار: جون ۲۰۲۷.'],['تجربه','ساخت وب‌اپلیکیشن، همکاری در خدمات دیجیتال خیریه و تدریس برنامه‌نویسی.'],['گام بعدی','ادامه تحصیل در مقطع ماستری بین‌المللی با تمرکز بر علوم کامپیوتر پیشرفته و یادگیری ماشین، سپس ساخت نرم‌افزارهای قابل‌اعتماد و ایجاد فرصت.']], download:'دانلود رزومه', portfolioTitle:'نمونه‌کارها', portfolioIntro:'گزیده‌ای از پروژه‌هایی که روی آن‌ها کار کرده‌ام.', filters:['همه','طراحی وب‌سایت','طراحی اپ موبایل','اپ دسکتاپ'], projectTech:'فناوری‌های استفاده‌شده', livePreview:'پیش‌نمایش زنده', closeProject:'بستن جزئیات پروژه', projectImageAlt:'تصویر پروژه', projectPreviewPending:'تصویر پیش‌نمایش پروژه به‌زودی اضافه می‌شود', contactTitle:'تماس با من', contactIntro:'پروژه‌ای در ذهن دارید؟ بیایید چیزی ارزشمند بسازیم.', placeholders:['نام','ایمیل','شماره تلفن','خدمات موردنظر','زمان‌بندی','جزئیات پروژه...'], send:'ارسال', sending:'در حال ارسال…', sent:'سپاس — پیام شما ذخیره شد.', error:'ارسال پیام انجام نشد. لطفاً دوباره تلاش کنید.', footerNav:['خانه','خدمات','درباره من','نمونه‌کارها','تماس با من'], language:'زبان', theme:'حالت سیاه‌وسفید' },
  fr: { nav:['Accueil','Services','À propos','Portfolio','Contact'], hire:'Me recruter', hello:'Bonjour, je suis', roles:['Développeuse web full stack','Designer UI/UX'], heroIntro:'Créative et passionnée, je transforme les idées en expériences numériques belles et faciles à utiliser.', servicesTitle:'Services', servicesIntro:'Un design réfléchi pour donner forme à vos idées.', services:[['Design web','Des designs modernes, adaptatifs et faciles à utiliser avec Figma et Adobe XD.'],['Développement frontend','Des applications web interactives avec HTML, CSS, JavaScript, Bootstrap, Tailwind CSS, React et Angular.'],['Projets full stack','Développement backend avec Node.js et frontend avec des frameworks modernes.'],['Montage vidéo','Montage de vidéos promotionnelles et de reels avec les outils Adobe.'],['Enseignement','Expérience dans l’enseignement de l’anglais, de l’informatique et des compétences numériques.']], aboutTitle:'À propos de moi', aboutBio:'Originaire d’Hérat, en Afghanistan, j’étudie l’informatique à Astana IT University, au Kazakhstan. Passionnée par la technologie et la résolution de problèmes, je souhaite créer des logiciels utiles et ouvrir de nouvelles possibilités grâce à l’innovation.', about:[['Formation','Licence en informatique à Astana IT University · prévue en juin 2027.'],['Expérience','Création d’applications web, soutien aux services numériques d’une association et enseignement de la programmation.'],['Pour la suite','Préparer un master international en informatique avancée et apprentissage automatique, puis créer des logiciels fiables et ouvrir des opportunités.']], download:'Télécharger le CV', portfolioTitle:'Portfolio', portfolioIntro:'Une sélection de projets sur lesquels j’ai travaillé.', filters:['Tout','Design web','Design mobile','Application bureau'], projectTech:'Technologies utilisées', livePreview:'Aperçu en direct', closeProject:'Fermer les détails du projet', projectImageAlt:'Capture du projet', projectPreviewPending:'Aperçu du projet bientôt disponible', contactTitle:'Me contacter', contactIntro:'Un projet en tête ? Créons quelque chose de remarquable.', placeholders:['Nom','E-mail','Téléphone','Service souhaité','Délai','Détails du projet...'], send:'Envoyer', sending:'Envoi…', sent:'Merci — votre message a été enregistré.', error:'Envoi impossible. Veuillez réessayer.', footerNav:['Accueil','Services','À propos','Portfolio','Contact'], language:'Langue', theme:'Mode noir et blanc' }
}

function App() {
  const [projects, setProjects] = useState(initialProjects)
  const [selectedProject, setSelectedProject] = useState(null)
  const [skillsVisible, setSkillsVisible] = useState(false)
  const skillsRef = useRef(null)
  const [language, setLanguage] = useState(() => localStorage.getItem('portfolio-language') || 'en')
  const [isMonochrome, setIsMonochrome] = useState(() => localStorage.getItem('portfolio-monochrome') === 'true')
  const t = translations[language]
  useEffect(() => { document.body.classList.toggle('light-page', isMonochrome) }, [isMonochrome])
  const setSiteLanguage = (value) => { setLanguage(value); setRoleIndex(0); setRoleText(''); setDeletingRole(false); localStorage.setItem('portfolio-language', value) }
  const toggleMonochrome = () => setIsMonochrome((value) => { localStorage.setItem('portfolio-monochrome', String(!value)); return !value })
  const [filter, setFilter] = useState('All')
  const [menuOpen, setMenuOpen] = useState(false)
  const [roleIndex, setRoleIndex] = useState(0)
  const [roleText, setRoleText] = useState('')
  const [deletingRole, setDeletingRole] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', timeline: '', message: '' })
  const [formState, setFormState] = useState('idle')
  const visibleProjects = useMemo(() => filter === 'All' ? projects : projects.filter((project) => (project.type || project.category) === filter), [filter, projects])
  useEffect(() => {
    const currentRole = t.roles[roleIndex]
    const pause = !deletingRole && roleText === currentRole ? 1350 : deletingRole && roleText === '' ? 260 : deletingRole ? 34 : 58
    const timer = window.setTimeout(() => {
      if (deletingRole) {
        if (roleText === '') {
          setDeletingRole(false)
          setRoleIndex((index) => (index + 1) % roleTitles.length)
        } else {
          setRoleText((text) => text.slice(0, -1))
        }
      } else if (roleText === currentRole) {
        setDeletingRole(true)
      } else {
        setRoleText(currentRole.slice(0, roleText.length + 1))
      }
    }, pause)
    return () => window.clearTimeout(timer)
  }, [deletingRole, roleIndex, roleText, language])

  useEffect(() => {
    if (!selectedProject) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event) => { if (event.key === 'Escape') setSelectedProject(null) }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [selectedProject])

  useEffect(() => {
    const skillsElement = skillsRef.current
    if (!skillsElement) return
    if (!('IntersectionObserver' in window)) {
      setSkillsVisible(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      setSkillsVisible(entry.isIntersecting)
    }, { threshold: 0.12 })
    observer.observe(skillsElement)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    fetch('/api/projects').then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => {
        if (!data.length) return
        const categories = ['Website Design', 'Website Design', 'App Desktop', 'App Mobile Design', 'App Desktop', 'App Mobile Design']
        const loaded = data.map((project, index) => ({ ...initialProjects[index], ...project, techStack: initialProjects[index]?.techStack || [], liveUrl: project.live_url || initialProjects[index]?.liveUrl, type: categories[index] || 'Website Design' }))
        const visualFill = initialProjects.slice(loaded.length).map((project, index) => ({ ...project, id: `sample-${index}`, type: project.type }))
        setProjects([...loaded, ...visualFill])
      }).catch(() => {})
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const submitMessage = async (event) => {
    event.preventDefault()
    setFormState('sending')
    const details = [`Phone: ${form.phone || 'Not provided'}`, `Service: ${form.service || 'Not specified'}`, `Timeline: ${form.timeline || 'Not specified'}`, '', form.message].join('\n')
    try {
      const response = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, message: details }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not send message')
      setFormState('sent')
      setForm({ name: '', email: '', phone: '', service: '', timeline: '', message: '' })
    } catch { setFormState('error') }
  }

  const translatedFilters = t.filters
  return <div className={`portfolio-app${isMonochrome ? ' monochrome' : ''}`} lang={language === 'fa' ? 'fa' : language} dir={language === 'fa' ? 'rtl' : 'ltr'}>
    <header className="site-header">
      <a className="logo" href="#home" onClick={closeMenu}>AZADEH</a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
        <a className="active" href="#home" onClick={closeMenu}>{t.nav[0]}</a><a href="#services" onClick={closeMenu}>{t.nav[1]}</a><a href="#about" onClick={closeMenu}>{t.nav[2]}</a><a href="#portfolio" onClick={closeMenu}>{t.nav[3]}</a><a href="#contact" onClick={closeMenu}>{t.nav[4]}</a>
      </nav>
      <div className="header-actions"><label className="language-control" title={t.language}><Globe2 size={16}/><select aria-label={t.language} value={language} onChange={(e) => setSiteLanguage(e.target.value)}><option value="en">EN</option><option value="fa">فارسی</option><option value="fr">FR</option></select><ChevronDown className="language-chevron" size={13}/></label><button className="theme-toggle" type="button" onClick={toggleMonochrome} aria-label={t.theme} title={t.theme} aria-pressed={isMonochrome}><Sun size={19}/></button></div>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-copy"><p className="hello">{t.hello}</p><h2>Azadeh Ahmadi</h2><h1 className="hero-role" aria-label="Full Stack Web Developer and UI/UX Designer"><span aria-hidden="true">{roleText}</span><span className="type-cursor" aria-hidden="true">|</span></h1><p className="hero-intro">{t.heroIntro}</p>
          <div className="socials"><a href="https://www.linkedin.com/in/azadeh-ahmadi-073b42354/" aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin/></a><a href="https://x.com/Azadeh42496882" aria-label="X" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></a><a href="https://github.com/azadehahmadi080" aria-label="GitHub" target="_blank" rel="noreferrer"><Github/></a></div>
          <div className="hero-actions"><a className="button button-orange" href="#contact">{t.hire}</a><a className="button button-outline" href="#about">{t.download}</a></div>
        </div>
        <div className="hero-portrait"><div className="portrait-disc"/><img src="/profileimg.jpeg" alt="Azadeh Ahmadi working at her computer" /></div>
        <a className="scroll-hint" href="#services"><ArrowDown/><span>SCROLL TO EXPLORE</span></a>
      </section>

      <section className="services-section section-wrap" id="services"><div className="section-title"><h2>{t.servicesTitle}</h2><p>{t.servicesIntro}</p></div><div className="service-grid">{t.services.map(([title, copy], index) => { const Icon = serviceIcons[index]; return <article className="service-card" key={title}><div className="service-icon"><Icon/></div><h3>{title}</h3><p>{copy}</p></article> })}</div></section>

      <section className="about-section section-wrap" id="about">
        <div className="section-title about-section-title"><h2>{t.aboutTitle}</h2></div>
        <div className="about-layout"><div className="about-photo-frame"><div className="about-photo"><img src="/profileimg.jpeg" alt="Azadeh Ahmadi working at her computer" loading="lazy"/></div></div><div className="about-copy"><p className="about-bio">{t.aboutBio}</p><div className="about-story">{t.about.map(([label, text], index) => { const Icon = aboutIcons[index]; return <article className="about-story-block" key={label}><span className="about-story-icon"><Icon/></span><div><h3>{label}</h3><p>{text}</p></div></article> })}</div><a className="button button-orange" href="/Azadeh-Ahmadi-CV.pdf" download><ArrowDownToLine size={16}/> {t.download} <ArrowUpRight size={15}/></a></div></div>
        <div className="skill-row" ref={skillsRef}>{skills.map(([name, amount, glyph], index) => <div className="skill" key={name}><div className="skill-ring" role="img" aria-label={`${name} proficiency`} style={{'--skill-progress': `${skillsVisible ? amount * 3.6 : 0}deg`, transitionDelay: `${index * 100}ms`}}><span>{glyph}</span></div><small>{name}</small></div>)}</div>
      </section>

      <section className="portfolio-section section-wrap" id="portfolio"><div className="section-title"><h2>{t.portfolioTitle}</h2><p>{t.portfolioIntro}</p></div><div className="filter-row" role="tablist" aria-label="Filter projects">{translatedFilters.map((item, index) => <button key={item} role="tab" aria-selected={filter === filters[index]} className={filter === filters[index] ? 'filter active' : 'filter'} onClick={() => setFilter(filters[index])}>{item}</button>)}</div><div className="portfolio-grid">{visibleProjects.map((project, index) => <a className={`portfolio-card image-${index % 4}`} href="#project-details" aria-haspopup="dialog" aria-label={`${project.title} project details`} onClick={(event) => { event.preventDefault(); setSelectedProject(project) }} key={project.id}><div className="portfolio-image">{project.image ? <img src={project.image} alt={project.title} loading="lazy"/> : <div className="project-image-placeholder"><span>{project.title}</span><i/><i/><i/></div>}<span className="image-link"><ArrowUpRight/></span><span className="project-preview"><b>{project.title}</b><small>{project.description}</small></span></div><div className="portfolio-meta"><span>{project.title}</span><span>{project.category}</span></div></a>)}</div></section>

      <section className="contact-section section-wrap" id="contact"><div className="section-title"><h2>{t.contactTitle}</h2><p>{t.contactIntro}</p></div><form className="contact-form" onSubmit={submitMessage}><div className="form-grid"><input required maxLength="120" aria-label={t.placeholders[0]} placeholder={t.placeholders[0]} value={form.name} onChange={(e) => setForm({...form, name:e.target.value})}/><input required type="email" maxLength="254" aria-label={t.placeholders[1]} placeholder={t.placeholders[1]} value={form.email} onChange={(e) => setForm({...form, email:e.target.value})}/><input aria-label={t.placeholders[2]} placeholder={t.placeholders[2]} value={form.phone} onChange={(e) => setForm({...form, phone:e.target.value})}/><select aria-label={t.placeholders[3]} value={form.service} onChange={(e) => setForm({...form, service:e.target.value})}><option value="">{t.placeholders[3]}</option>{t.services.map(([name]) => <option key={name}>{name}</option>)}</select><input aria-label={t.placeholders[4]} placeholder={t.placeholders[4]} value={form.timeline} onChange={(e) => setForm({...form, timeline:e.target.value})}/><textarea required maxLength="4500" aria-label={t.placeholders[5]} placeholder={t.placeholders[5]} value={form.message} onChange={(e) => setForm({...form, message:e.target.value})}/></div><button className="button button-orange send-button" type="submit" disabled={formState === 'sending'}>{formState === 'sending' ? t.sending : t.send} <ArrowUpRight size={15}/></button>{formState === 'sent' && <p className="form-feedback success" role="status">{t.sent}</p>}{formState === 'error' && <p className="form-feedback error" role="alert">{t.error}</p>}</form></section>
    </main>

    {selectedProject && <div className="project-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProject(null) }}><section className="project-modal" id="project-details" role="dialog" aria-modal="true" aria-labelledby="project-modal-title"><button type="button" className="project-modal-close" aria-label={t.closeProject} onClick={() => setSelectedProject(null)}><X/></button><div className="project-modal-content"><h2 id="project-modal-title">{selectedProject.title}</h2><p className="project-modal-description">{selectedProject.description}</p>{selectedProject.techStack?.length > 0 && <div className="project-tech"><strong>{t.projectTech}:</strong><span>{selectedProject.techStack.join(', ')}</span></div>}{selectedProject.image ? <img className="project-modal-image" src={selectedProject.image} alt={`${selectedProject.title} ${t.projectImageAlt}`} /> : <div className="project-modal-placeholder"><span>{selectedProject.title}</span><p>{t.projectPreviewPending}</p><div className="placeholder-dashboard"><i/><i/><i/><b/><b/><b/></div></div>}{selectedProject.liveUrl && <a className="project-live-link" href={selectedProject.liveUrl} target="_blank" rel="noreferrer">{t.livePreview}<ArrowUpRight size={18}/></a>}</div></section></div>}

    <footer className="site-footer"><a className="logo" href="#home">AZADEH</a><nav><a href="#home">{t.footerNav[0]}</a><a href="#services">{t.footerNav[1]}</a><a href="#about">{t.footerNav[2]}</a><a href="#portfolio">{t.footerNav[3]}</a><a href="#contact">{t.footerNav[4]}</a></nav><div className="footer-socials"><a href="https://www.linkedin.com/in/azadeh-ahmadi-073b42354/" aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin/></a><a href="https://x.com/Azadeh42496882" aria-label="X" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></a><a href="https://github.com/azadehahmadi080" aria-label="GitHub" target="_blank" rel="noreferrer"><Github/></a></div><div className="footer-bottom"><span>© 2026 Azadeh Ahmadi. All rights reserved.</span></div></footer>
  </div>
}

export default App
