"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ATSResult = ({ analysis }) => {
    const [expandedSections, setExpandedSections] = useState({
        toneAndStyle: false,
        content: false,
        structure: false,
        skills: false,
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'strong': return 'text-green-600';
            case 'good start': return 'text-yellow-600';
            case 'needs work': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getScoreColor = (score) => {
        if (score >= 70) return 'text-green-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'destructive';
            case 'medium': return 'secondary';
            case 'low': return 'outline';
            default: return 'outline';
        }
    };

    if (!analysis) return null;

    return (
        <div className="space-y-6">
            {/* Overall Score Card */}
            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="text-2xl">Your Resume Score</CardTitle>
                    <p className="text-muted-foreground text-sm">
                        This score is calculated based on the variables listed below.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-8 mb-6">
                        <div className="relative w-40 h-40">
                            <svg className="w-38 h-38 transform -rotate-90">
                                <circle
                                    cx="94"
                                    cy="100"
                                    r="64"
                                    stroke="currentColor"
                                    strokeWidth="13"
                                    fill="none"
                                    className="text-gray-200"
                                />
                                <circle
                                    cx="94"
                                    cy="100"
                                    r="64"
                                    stroke="currentColor"
                                    strokeWidth="13"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 56}`}
                                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - analysis.overallScore / 100)}`}
                                    className="text-gradient transition-all duration-1000"
                                    style={{
                                        stroke: analysis.overallScore >= 70 ? '#10b981' :
                                            analysis.overallScore >= 40 ? '#f59e0b' : '#ef4444'
                                    }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-semibold">{analysis.overallScore}/100</span>
                                <span className="text-sm text-muted-foreground">{analysis.totalIssues} issues</span>
                            </div>
                        </div>
                    </div>

                    {/* Category Scores */}
                    <div className="space-y-4">
                        {Object.entries(analysis.categories).map(([key, category]) => (
                            <div key={key} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold capitalize">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </h3>
                                        <Badge variant="outline" className={getStatusColor(category.status)}>
                                            {category.status}
                                        </Badge>
                                    </div>
                                    <span className={`text-xl font-bold ${getScoreColor(category.score)}`}>
                                        {category.score}/100
                                    </span>
                                </div>
                                <Progress value={category.score} className="h-2 mb-2" />
                                <p className="text-sm text-muted-foreground mb-3">{category.feedback}</p>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleSection(key)}
                                    className="w-full justify-between"
                                >
                                    <span>View improvement tips</span>
                                    {expandedSections[key] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>

                                {expandedSections[key] && (
                                    <ul className="mt-3 space-y-2 text-sm">
                                        {category.tips.map((tip, idx) => (
                                            <li key={idx} className="flex gap-2">
                                                <span className="text-primary">•</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ATS Compatibility */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <CardTitle>ATS Score - {analysis.overallScore}/100</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">
                            How well does your resume pass through Applicant Tracking Systems?
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Your resume was scanned like an employer would. Here's how it performed:
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            {analysis.atsCompatibility.isReadable ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className="text-sm">Clear formatting, readable by ATS</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {analysis.atsCompatibility.hasRelevantKeywords ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className="text-sm">Keywords relevant to the job</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {analysis.atsCompatibility.hasSkillsSection ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            )}
                            <span className="text-sm">
                                {analysis.atsCompatibility.hasSkillsSection
                                    ? 'Skills section detected'
                                    : 'No skills section detected'}
                            </span>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-4">
                        {analysis.atsCompatibility.feedback}
                    </p>
                </CardContent>
            </Card>

            {/* Keyword Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle>Keyword Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm mb-2 text-green-600">Matched Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.keywordMatches.matched.map((keyword, idx) => (
                                <Badge key={idx} variant="outline" className="bg-green-500 text-gray-900">
                                    {keyword}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-2 text-red-600">Missing Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.keywordMatches.missing.map((keyword, idx) => (
                                <Badge key={idx} variant="outline" className="bg-red-500">
                                    {keyword}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Improvement Suggestions */}
            <Card>
                <CardHeader>
                    <CardTitle>Priority Improvements</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Want a better score? Improve your resume by applying the suggestions listed below.
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {analysis.improvements.map((improvement, idx) => (
                            <div key={idx} className="border rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Badge variant={getPriorityColor(improvement.priority)}>
                                        {improvement.priority}
                                    </Badge>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm mb-1">{improvement.category}</h4>
                                        <p className="text-sm text-muted-foreground">{improvement.suggestion}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ATSResult;