const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const postsToUpload = [
    {
        title: "From Ghana to Global Research: The Journey of a Biomedical Engineer at York University",
        excerpt: "The inspiring story of transitioning from the University of Ghana into advanced 3D bioprinting and tissue engineering research at York University.",
        category: "Research",
        readTime: "5 min",
        image: "/dry.png",
        published: true,
        date: new Date(),
        content: `
            <p>The journey of a researcher is rarely a straight line, but for a biomedical engineer transitioning from West Africa to the cutting-edge laboratories of Canada, it is a testament to perseverance, academic excellence, and the borderless nature of scientific discovery.</p>

            <h3>Foundations in Ghana: Where the Spark Began</h3>
            <p>It all began at the <strong>University of Ghana</strong>, where a deep-seated curiosity about the intersection of biology and engineering first took root. Studying Biomedical Engineering provided the foundational knowledge in physiology, materials science, and programming. However, theory is only one side of the coin; real-world impact requires practical experience.</p>
            <p>Working at the prestigious <strong>Noguchi Memorial Institute for Medical Research</strong> (NMIMR) was a pivotal turning point. It provided exposure to rigorous diagnostic methodologies, infectious disease research, and the absolute necessity of precision. NMIMR is a beacon of medical research in Africa, and it was here that the true potential of using engineering principles to solve complex health challenges became clear.</p>

            <h3>Crossing Oceans: The Transition to Canada</h3>
            <p>Transitioning from the academic environment of Ghana to <strong>York University</strong> in Toronto, Canada, presented both immense opportunities and unique challenges. Adapting to a new country, navigating a different educational ecosystem, and diving into advanced biological research required resilience and adaptability.</p>
            <p>York University's state-of-the-art facilities provided the perfect launchpad. But what truly accelerated this transition was becoming an <strong>NSERC CREATE Research Fellow</strong>. This fellowship provided not only financial support but also a collaborative interdisciplinary network of scientists, engineers, and industry partners dedicated to pushing the boundaries of biotechnology.</p>

            <h3>Pioneering the Future: 3D Bioprinting and Tissue Engineering</h3>
            <p>At York, the research focus shifted to one of the most exciting and complex frontiers in modern medicine: <strong>3D bioprinting and tissue engineering</strong>. By combining biocompatible hydrogels with living cellular components, the lab works to print functional, three-dimensional biological structures.</p>
            <p>This research has the potential to revolutionize how we test new drugs, study disease progression, and ultimately, address the critical shortage of organ donors worldwide. It is a brilliant blend of mechanical precision, material chemistry, and cellular biology.</p>

            <blockquote>"The future of medicine is not just about treating disease; it's about printing the solutions."</blockquote>

            <h3>Key Lessons for Aspiring Students</h3>
            <p>For young African students looking to break into global STEM and advanced research, here are key takeaways from this journey:</p>
            <ul>
                <li><strong>Build a Strong Foundation:</strong> Master the core principles of your field during your undergraduate studies.</li>
                <li><strong>Seek Early Research Exposure:</strong> Work with local institutes like Noguchi or CSIR to gain practical lab experience before applying abroad.</li>
                <li><strong>Apply for Fellowships:</strong> Programs like NSERC CREATE exist to support excellent interdisciplinary talent. Don't hesitate to apply.</li>
                <li><strong>Embrace Interdisciplinary Learning:</strong> The most exciting innovations happen at the intersection of engineering, AI, and biology.</li>
            </ul>
        `
    },
    {
        title: "Why African Engineers Need Research Experience Before Chasing High Salaries",
        excerpt: "Why focusing on learning, internships, and building analytical skills creates long-term compounding career value instead of a quick-money mindset.",
        category: "Mentorship",
        readTime: "5 min",
        image: "/dry.png",
        published: true,
        // Set date to 1 day ago to preserve ordering
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        content: `
            <p>In today's fast-paced tech and engineering landscape, early career professionals are often encouraged to chase the highest starting salary. While financial stability is crucial, prioritizing short-term gains over deep technical and analytical depth can severely limit long-term career compounding. This is particularly true for young African engineers looking to compete on a global stage.</p>

            <h3>The Trap of the Quick-Money Mindset</h3>
            <p>It is easy to be enticed by entry-level roles that offer quick payouts but little room for intellectual growth. However, technology stacks change, libraries get deprecated, and low-level coding tasks are increasingly automated. What remains valuable is the ability to solve complex, unstructured, and novel problems. This is where research experience becomes your ultimate competitive advantage.</p>
            <p>A career built on research, intentional internships, and academic rigor builds a level of technical depth that cannot be easily replicated.</p>

            <h3>A Case Study in Career Progression</h3>
            <p>Consider the progression of an intentional career path:</p>
            <ol>
                <li><strong>Research Intern:</strong> Learning the scientific method, reading literature, and understanding how to formulate hypotheses.</li>
                <li><strong>Research Assistant:</strong> Designing experiments, managing equipment, and dealing with real-world, messy data.</li>
                <li><strong>Operations Lead:</strong> Managing teams, translating scientific findings into executable plans, and optimizing workflows.</li>
                <li><strong>Graduate & PhD Researcher:</strong> Owning a complex domain, contributing new knowledge to the scientific community, and collaborating globally.</li>
            </ol>
            <p>This ladder is not just a sequence of job titles; it is an active compounding of diverse, high-value skill sets. Each step adds layers of management, technical expertise, and system-level thinking.</p>

            <blockquote>"Focus on building the depth of your expertise first. The market will always reward exceptional problem-solvers."</blockquote>

            <h3>Why Analytical Skills and Technical Depth Compound</h3>
            <p>When you spend years in research environments, you learn how to handle ambiguity. You learn that when an experiment fails, it is not a dead end but a data point. This analytical mindset makes you incredibly valuable to deep-tech startups, global corporations, and top-tier research institutes.</p>
            <p>Instead of competing with thousands of developers who all completed the same 3-month coding bootcamp, you carve out a niche where your expertise is rare and highly sought after. Long-term compounding means that in 10 years, your earning potential and career impact will dwarf those who chose the immediate, low-ceiling path.</p>

            <h3>Lessons for Early-Career Professionals</h3>
            <p>If you are an engineer starting your journey, seek out research internships, participate in university labs, and focus on solving hard problems. The investment you make in your intellect today will pay compounding dividends for the rest of your life.</p>
        `
    },
    {
        title: "The Rise of African Deep-Tech Talent: What John David’s Career Says About the Future",
        excerpt: "John David’s journey as a case study for the growth of African talent in biotechnology, AI-driven healthcare, and global STEM collaboration.",
        category: "AI & Health",
        readTime: "6 min",
        image: "/dry.png",
        published: true,
        // Set date to 2 days ago to preserve ordering
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        content: `
            <p>The global narrative surrounding African technology has long been dominated by fintech and mobile money innovations. While these sectors have transformed daily life across the continent, a new, more profound wave of innovation is quietly emerging: the rise of African talent in <strong>deep-tech</strong> and advanced scientific research.</p>

            <h3>Beyond Software: The Biotech and Deep-Tech Revolution</h3>
            <p>Deep-tech fields—such as biotechnology, bioinformatics, AI-integrated healthcare, and advanced materials engineering—require substantial capital, years of research, and highly specialized talent. Historically, these resources were concentrated in the Global North.</p>
            <p>Today, however, brilliant African minds are challenging this concentration. John David’s trajectory from West Africa to Canadian bioprinting labs serves as a perfect case study for this shift. It demonstrates that with the right combination of foundational education, global collaboration, and sheer determination, African researchers can lead at the absolute cutting edge of biomedical engineering.</p>

            <h3>The Pillar Institutions</h3>
            <p>This growth is made possible by key institutions that act as talent engines and research hubs. For John David, this journey was shaped by critical organizations:</p>
            <ul>
                <li><strong>Noguchi Memorial Institute for Medical Research:</strong> Providing world-class training in diagnostics and biological sciences within Ghana.</li>
                <li><strong>Council for Scientific and Industrial Research (CSIR):</strong> Fostering industrial and scientific research to drive national development.</li>
                <li><strong>York University:</strong> Serving as a global collaborator offering the high-tech infrastructure needed for advanced tissue engineering and NSERC CREATE training.</li>
            </ul>

            <h3>The Role of Mentorship and Volunteering</h3>
            <p>Mentorship is the bridge that turns raw potential into global success. Supporting STEM initiatives, coaching local robotics teams, and volunteering for community education programs are vital. They build leadership capabilities and ensure that knowledge is shared across generations.</p>

            <h3>The Value of Interdisciplinary Engineers</h3>
            <p>The next decade of breakthroughs will not happen in academic silos. The most valuable professionals are <strong>interdisciplinary engineers</strong>—those who can write code, analyze genomic datasets, understand cellular biology, and design mechanical bioprinters.</p>
            <p>By crossing the boundaries between traditional engineering and healthcare, these individuals are uniquely positioned to solve global challenges, from personalized medicine to diagnostic tools tailored for rural clinics.</p>

            <blockquote>"Africa's next innovation wave will not just be about apps; it will be about life sciences, deep-tech hardware, and biological engineering."</blockquote>

            <h3>A Vision for the Future</h3>
            <p>The global scientific community is paying attention. The movement of African talent into international research groups fosters a rich exchange of ideas, bringing diverse perspectives to global health problems. As more African engineers gain experience in global labs, they build the network, expertise, and vision required to establish deep-tech hubs back home, paving the way for a self-reliant biotech ecosystem across the continent.</p>
        `
    }
];

async function main() {
    console.log('Starting upload of the requested blog posts...');
    
    for (const post of postsToUpload) {
        // Check if post with the same title already exists to avoid duplicates
        const existing = await prisma.post.findFirst({
            where: { title: post.title }
        });
        
        if (existing) {
            console.log(`Skipping: Post titled "${post.title}" already exists.`);
            continue;
        }
        
        const created = await prisma.post.create({
            data: post
        });
        console.log(`Successfully uploaded: "${created.title}" with ID: ${created.id}`);
    }
    
    console.log('Finished uploading posts.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Error during upload:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
