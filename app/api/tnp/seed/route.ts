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
    const db = client.db('new');

    // Sample TNP posts
    const samplePosts = [
      {
        title: 'Software Engineer - Full Stack',
        content: 'We are looking for a talented Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.',
        type: 'job',
        company: 'TechCorp Solutions',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        requirements: [
          'Bachelor\'s degree in Computer Science or related field',
          '2+ years of experience in web development',
          'Proficiency in React, Node.js, and MongoDB',
          'Strong problem-solving skills',
          'Excellent communication skills'
        ],
        applicationLink: 'https://techcorp.com/careers/apply',
        salary: '₹8-12 LPA',
        location: 'Bangalore, India',
        attachments: [],
        createdBy: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['job', 'tnp', 'software', 'full-stack']
      },
      {
        title: 'Data Science Internship',
        content: 'Join our data science team as an intern and work on exciting machine learning projects. This is a great opportunity to gain hands-on experience in data analysis and AI.',
        type: 'internship',
        company: 'DataTech Analytics',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        requirements: [
          'Currently pursuing degree in Computer Science, Statistics, or related field',
          'Knowledge of Python and data science libraries (pandas, numpy, scikit-learn)',
          'Understanding of machine learning concepts',
          'Strong analytical thinking',
          'Eagerness to learn and grow'
        ],
        applicationLink: 'https://datatech.com/internships',
        salary: '₹25,000/month',
        location: 'Remote',
        attachments: [],
        createdBy: session.user.id,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['internship', 'tnp', 'data-science', 'machine-learning']
      },
      {
        title: 'Frontend Developer',
        content: 'We are seeking a creative Frontend Developer to build beautiful and responsive user interfaces. You will work closely with our design team to bring mockups to life.',
        type: 'job',
        company: 'WebCraft Studios',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        requirements: [
          'Bachelor\'s degree in Computer Science or equivalent experience',
          '1+ years of experience in frontend development',
          'Expertise in HTML, CSS, JavaScript, and React',
          'Experience with responsive design',
          'Knowledge of version control (Git)'
        ],
        applicationLink: 'https://webcraft.com/jobs/frontend-dev',
        salary: '₹6-10 LPA',
        location: 'Mumbai, India',
        attachments: [],
        createdBy: session.user.id,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        tags: ['job', 'tnp', 'frontend', 'react']
      },
      {
        title: 'Product Management Internship',
        content: 'Get hands-on experience in product management by working with our product team. You will assist in market research, feature planning, and user experience optimization.',
        type: 'internship',
        company: 'InnovateTech',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        requirements: [
          'Currently pursuing MBA or related degree',
          'Strong analytical and communication skills',
          'Interest in technology and product development',
          'Experience with data analysis tools is a plus',
          'Creative problem-solving abilities'
        ],
        applicationLink: 'https://innovatetech.com/internships/pm',
        salary: '₹30,000/month',
        location: 'Pune, India',
        attachments: [],
        createdBy: session.user.id,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        tags: ['internship', 'tnp', 'product-management', 'business']
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
