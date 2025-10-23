import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== 'operator' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Operator or Admin role required.' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db('CTC');

    // Sample TNP posts
    const samplePosts = [
      {
        title: 'Software Engineer - Full Stack',
        content: 'We are looking for a talented Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.',
        type: 'job',
        company: 'TechCorp Solutions',
        location: 'Bangalore, India',
        salary: '₹8-12 LPA',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        requirements: 'Bachelor\'s degree in Computer Science or related field\n2+ years of experience in web development\nProficiency in React, Node.js, and MongoDB\nStrong problem-solving skills\nExcellent communication skills',
        applicationLink: 'https://techcorp.com/careers/apply',
        tags: [],
        attachments: [],
        image: null,
        author: {
          name: session.user.name,
          email: session.user.email,
          id: session.user.id
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Data Science Internship',
        content: 'Join our data science team as an intern and work on exciting machine learning projects. This is a great opportunity to gain hands-on experience in data analysis and AI.',
        type: 'internship',
        company: 'DataTech Analytics',
        location: 'Remote',
        salary: '₹25,000/month',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        requirements: 'Currently pursuing degree in Computer Science, Statistics, or related field\nKnowledge of Python and data science libraries (pandas, numpy, scikit-learn)\nUnderstanding of machine learning concepts\nStrong analytical thinking\nEagerness to learn and grow',
        applicationLink: 'https://datatech.com/internships',
        tags: [],
        attachments: [],
        image: null,
        author: {
          name: session.user.name,
          email: session.user.email,
          id: session.user.id
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Frontend Developer',
        content: 'We are seeking a creative Frontend Developer to build beautiful and responsive user interfaces. You will work closely with our design team to bring mockups to life.',
        type: 'job',
        company: 'WebCraft Studios',
        location: 'Mumbai, India',
        salary: '₹6-10 LPA',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        requirements: 'Bachelor\'s degree in Computer Science or equivalent experience\n1+ years of experience in frontend development\nExpertise in HTML, CSS, JavaScript, and React\nExperience with responsive design\nKnowledge of version control (Git)',
        applicationLink: 'https://webcraft.com/jobs/frontend-dev',
        tags: [],
        attachments: [],
        image: null,
        author: {
          name: session.user.name,
          email: session.user.email,
          id: session.user.id
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Product Management Internship',
        content: 'Get hands-on experience in product management by working with our product team. You will assist in market research, feature planning, and user experience optimization.',
        type: 'internship',
        company: 'InnovateTech',
        location: 'Pune, India',
        salary: '₹30,000/month',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        requirements: 'Currently pursuing MBA or related degree\nStrong analytical and communication skills\nInterest in technology and product development\nExperience with data analysis tools is a plus\nCreative problem-solving abilities',
        applicationLink: 'https://innovatetech.com/internships/pm',
        tags: [],
        attachments: [],
        image: null,
        author: {
          name: session.user.name,
          email: session.user.email,
          id: session.user.id
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    // Insert the sample posts
    const result = await db.collection('tnp_posts').insertMany(samplePosts);

    return NextResponse.json({
      success: true,
      message: 'Sample TNP posts created successfully',
      insertedCount: result.insertedCount,
      posts: samplePosts.map(post => ({
        title: post.title,
        company: post.company,
        type: post.type,
        deadline: post.deadline
      }))
    });

  } catch (error: any) {
    console.error('Error creating sample TNP posts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create sample TNP posts' },
      { status: 500 }
    );
  }
}
