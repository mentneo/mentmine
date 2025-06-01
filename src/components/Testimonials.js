import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

function Testimonials({ maxReviews = 6 }) {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				setLoading(true);

				// Simplified query to avoid composite index requirement
				const reviewsQuery = query(
					collection(db, 'reviews'),
					orderBy('createdAt', 'desc'),
					limit(maxReviews * 2) // Get more to filter client-side
				);

				const snapshot = await getDocs(reviewsQuery);
				const reviewsList = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				// Filter for approved reviews in JavaScript instead of in the query
				const filteredReviews = reviewsList
					.filter((review) => review.approved === true)
					.slice(0, maxReviews);

				setReviews(filteredReviews);
			} catch (err) {
				console.error('Error fetching reviews:', err);
				setError('Failed to load testimonials');
			} finally {
				setLoading(false);
			}
		};

		fetchReviews();
	}, [maxReviews]);

	// Handle auto-scroll for testimonials
	useEffect(() => {
		if (reviews.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [reviews.length]);

	// Change to specific testimonial
	const goToTestimonial = (index) => {
		setCurrentIndex(index);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
				{error}
			</div>
		);
	}

	if (reviews.length === 0) {
		return null;
	}

	return (
		<div className="py-16 bg-blue-900 text-white">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2
						className="text-3xl font-bold mb-4"
						data-aos="fade-up"
					>
						What Our Students Say
					</h2>
					<p
						className="text-lg text-blue-100 max-w-2xl mx-auto"
						data-aos="fade-up"
						data-aos-delay="100"
					>
						Hear from our students about their learning experience with
						Mentneo
					</p>
				</div>

				<div
					className="max-w-4xl mx-auto relative"
					data-aos="fade-up"
					data-aos-delay="200"
				>
					{/* Large screen testimonial carousel */}
					<div className="hidden md:block">
						<div className="grid grid-cols-3 gap-6">
							{reviews.slice(0, 3).map((review) => (
								<div
									key={review.id}
									className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 text-white"
								>
									<div className="flex items-center text-yellow-300 mb-2">
										{[...Array(5)].map((_, i) => (
											<FaStar
												key={i}
												className={
													i < review.rating
														? 'text-yellow-300'
														: 'text-gray-400'
												}
											/>
										))}
									</div>

									<div className="mb-4 relative">
										<FaQuoteLeft className="text-blue-300 text-xl absolute -left-2 -top-2 opacity-50" />
										<p className="text-blue-100 italic">
											{review.comment}
										</p>
									</div>

									<div className="mt-4">
										<p className="font-medium">{review.name}</p>
										{review.course && (
											<p className="text-sm text-blue-200">
												{review.course}
											</p>
										)}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Mobile testimonial carousel */}
					<div className="md:hidden">
						<div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 text-white">
							<div className="flex items-center text-yellow-300 mb-2">
								{[...Array(5)].map((_, i) => (
									<FaStar
										key={i}
										className={
											i < reviews[currentIndex].rating
												? 'text-yellow-300'
												: 'text-gray-400'
										}
									/>
								))}
							</div>

							<div className="mb-4 relative">
								<FaQuoteLeft className="text-blue-300 text-xl absolute -left-2 -top-2 opacity-50" />
								<p className="text-blue-100 italic">
									{reviews[currentIndex].comment}
								</p>
							</div>

							<div className="mt-4">
								<p className="font-medium">{reviews[currentIndex].name}</p>
								{reviews[currentIndex].course && (
									<p className="text-sm text-blue-200">
										{reviews[currentIndex].course}
									</p>
								)}
							</div>
						</div>

						{/* Dots indicator for mobile */}
						<div className="flex justify-center mt-4 space-x-2">
							{reviews.map((_, index) => (
								<button
									key={index}
									onClick={() => goToTestimonial(index)}
									className={`w-2 h-2 rounded-full ${
										index === currentIndex
											? 'bg-white'
											: 'bg-blue-200 bg-opacity-50'
									}`}
									aria-label={`Go to testimonial ${index + 1}`}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Testimonials;
